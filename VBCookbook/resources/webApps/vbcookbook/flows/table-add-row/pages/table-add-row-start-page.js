/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define(['ojs/ojbufferingdataprovider'], function (BufferingDataProvider) {
  'use strict';

  var PageModule = function PageModule() {
    this.editInProgressPromise = Promise.resolve();
    this.resetAddRowElements = (table) => {
      const editables = table.querySelectorAll('.addRowEditable');
      for (let i = 0; i < editables.length; i++) {
        const editable = editables.item(i);
        editable.reset();
      }
    };
  };

  PageModule.prototype.startEditing = function (rowKey) {
    this.rowBeingEditted = rowKey;
    var self = this;
    this.editInProgressPromise = new Promise((resolve, reject) => {
      self.resolveHandler = resolve;
    });
  };

  PageModule.prototype.endEditing = function (rowKey) {
    if (rowKey !== this.rowBeingEditted) {
      // the nature of events is that editing multiple rows in one go will
      // cause multiple calls to startEditing and endEditing and it is important
      // it ignore endEditing if it is NOT for row being currently edited - such
      // event can be safely ignored here
      return;
    }
    if (this.resolveHandler) {
      this.resolveHandler();
    }
  };

  PageModule.prototype.isEditingFinished = function () {
    return this.editInProgressPromise;
  };

  var bufferingDP;

  PageModule.prototype.createBufferingDP = function (baseDP) {
    bufferingDP = new BufferingDataProvider(baseDP);
    bufferingDP.addEventListener("submittableChange", (event) => {
      // BufferingDataProvider fires the "submittableChange" event whenever there is a change in the number of submittable items.
      // We can use this to update the UI.
      const submittableRows = event.detail;
      this.showSubmittableItems(submittableRows);


    });
    return bufferingDP;
  }

  /**
   * Trigger form validation and return true if form is valid. Form in
   * this recipe is currently editted row.
   */
  PageModule.prototype.isFormValid = function (detail, event, rowType) {
    if (detail !== undefined && detail.cancelEdit == true) {
      return true;
    }
    if (detail !== undefined && detail.cancelAdd === true) {
      this.resetAddRowElements(document.getElementById('addRow-editable-table'));
      return true;
    }
    // iterate over editable fields which are marked with "editable" class
    // and make sure they are valid:
    var table = event.target;
    var editables;

    if (rowType == "editRow")
      editables = table.querySelectorAll('.editable');
    else if (rowType == "addRow")
      editables = table.querySelectorAll('.addRowEditable');
    else
      editables = null;

    for (var i = 0; i < editables.length; i++) {
      var editable = editables.item(i);
      editable.validate();
      // Table does not currently support editables with async validators
      // so treating editable with 'pending' state as invalid
      if (editable.valid !== 'valid') {
        return false;
      }
    }
    return true;
  };

  var nextIdValue;

  /**
   * Newly inserted row needs to have a unique ID so that DataProvider
   * can handle it. This function generates new ID which is unique in
   * the client. This ID will be removed during Save operation as VB
   * backend assign each record unique ID according to underlying DB table.
   */
  PageModule.prototype.getNextId = function () {
    if (nextIdValue === undefined) {
      nextIdValue = 10000;
    }
    ++nextIdValue;
    return nextIdValue;
  };

  /**
  * Helper method to format min and max salary for range presentation in table column.
  * The helper method also handles state when job description is not yet available.
  */
  PageModule.prototype.getFormattedSalaryRange = function (currentRowBuffer,
    disableRowEditExit) {
    var range = '';
    if (currentRowBuffer.jobObject.items[0] !== undefined && currentRowBuffer.jobObject
      .items[0].minSalary !== undefined) {
      range = '$' + currentRowBuffer.jobObject.items[0].minSalary + ' - ' +
        currentRowBuffer.jobObject.items[0].maxSalary;
    }
    return disableRowEditExit ? 'loading...' : range;
  };

  /**
   * Custom validator which checks that entered salary fits job's salary range.
   */
  PageModule.prototype.salaryInRangeValidator = function (record,
    disableRowEditExit) {
    return {
      getHint: () => {
        return 'Salary has to be in job salary range';
      },
      validate: value => {
        var jobRecord = record.jobObject.items[0];
        if (jobRecord.minSalary === undefined) {
          throw new Error(
            'cannot validate because range is not available yet');
        } else if (value >= jobRecord.minSalary && value <= jobRecord.maxSalary) {
          return;
        } else {
          throw new Error('salary is out of the salary range');
        }
      }
    };
  };

  PageModule.prototype.areDifferent = function (newValue, oldValue) {
    if(JSON.stringify(newValue) === JSON.stringify(oldValue))
    return false
    else 
    return true;
  };

  PageModule.generateBatchSnippet = function (url, payload, operation, id) {
    return {
      id: id ? id : "someID",
      path: url,
      operation: operation,
      payload: payload ? payload : {}
    };
  };

  PageModule.prototype.createBatchPayload = function () {
    var payloads = [];
    var uniqueId = (new Date().getTime());
    let editItems = bufferingDP.getSubmittableItems();
    editItems.forEach(editItem => {
      var change = editItem.operation;
      var key = editItem.item.data.id;
      // clone record - some properties will be deleted from the clone:
      var record = JSON.parse(JSON.stringify(editItem.item.data));
      if (change === 'remove') {
        payloads.push(PageModule.generateBatchSnippet("/Employee/" +
          key, {}, 'delete'));
      } else if (change === 'add') {
        delete record.departmentObject;
        delete record.jobObject;
        delete record.id;
        // default some required fields:
        record.email = 'person' + (++uniqueId) + '@company.com';
        record.hireDate = new Date();
        record.department = 1;
        payloads.push(PageModule.generateBatchSnippet("/Employee",
          record, 'create'));
      } else if (change === 'update') {
        delete record.departmentObject;
        delete record.jobObject;
        payloads.push(PageModule.generateBatchSnippet("/Employee/" +
          key, record, 'update'));
      }
    });
    return {
      parts: payloads
    };
  };

  // Setting the status of saved items to 'submitting'
  PageModule.prototype.setStatusToSubmitting = function () {
    let editItems = bufferingDP.getSubmittableItems();
    editItems.forEach(editItem => {
      this.setItemStatus(editItem, "submitting");
    });
    return editItems;
  };

  // Setting the status of saved items to 'submitted'
  PageModule.prototype.setStatusToSubmitted = function (submittableItems) {
    submittableItems.forEach(editItem => {
      this.setItemStatus(editItem, "submitted");
    });
  };

  // Setting the status of saved items to 'unsubmitted'
  PageModule.prototype.setStatusToUnsubmitted = function (unsubmittableItems) {
    unsubmittableItems.forEach(editItem => {
      this.setItemStatus(editItem, "unsubmitted");
    });
  };

  PageModule.prototype.addItem = function (key, data) {
    bufferingDP.addItem({ metadata: { key: key }, data: data });
  };

  PageModule.prototype.removeItem = function (key, data) {
    bufferingDP.removeItem({ metadata: { key: key }, data: data });
  };
  PageModule.prototype.updateItem = function (key, data) {
    bufferingDP.updateItem({ metadata: { key: key }, data: data });
  };

  PageModule.prototype.getSubmittableItems = function () {
    return bufferingDP.getSubmittableItems();
  };

  PageModule.prototype.setItemStatus = function (editItem, status, error) {
    bufferingDP.setItemStatus(editItem, status, error);
  };

  PageModule.prototype.showSubmittableItems = function (submittableRows) {
    let textarea = document.getElementById("bufferContent");
    var textValue = "";
    submittableRows.forEach((editItem) => {
      textValue += "Operation: " + editItem.operation + ", ";
      textValue += "Row ID: " + editItem.item.data.id;
      if (editItem.item.metadata.message) {
        textValue +=
          " error: " + JSON.stringify(editItem.item.metadata.message);
      }
      textValue += "\n";
    });
    textarea.value = textValue;
  };

  PageModule.prototype.submitRow = function (current) {
    current.submitAddRow(false);
  };

  PageModule.prototype.cancelRow = function (current) {
    current.submitAddRow(true);
  };

  return PageModule;
});
