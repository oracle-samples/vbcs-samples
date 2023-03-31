/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define(['ojs/ojrowdatagridprovider', 'ojs/ojbufferingdataprovider', 'ojs/ojconverter-number'], (RowDataGridProvider, BufferingDataProvider, NumberConverter) => {
  'use strict';

  var PageModule = function PageModule() { };
  var bufferingDP = null;
  var dataColumnNames = ['firstName', 'lastName', 'jobObject', 'salary', 'jobObject'];
  var bufferredRowData = null; // holds cell's original data
  var editingInProgress = false; // keeps track if editing is going on
  var numberConverter = new NumberConverter.IntlNumberConverter({
    style: 'currency',
    currency: 'USD',
    currencyDisplay: 'symbol',
    maximumFractionDigits: 0
  });

  /**
   *
   * @param {String} sdp
   * @return {String}
   */
  PageModule.prototype.getRowGridDataProvider = function (sdp) {
    bufferingDP = new BufferingDataProvider(sdp);
    bufferingDP.addEventListener("submittableChange", (event) => {
      const submittableRows = event.detail;
      this.showSubmittableItems(submittableRows);
    });

    return new RowDataGridProvider.RowDataGridProvider(bufferingDP, {
      columns: {
        rowHeader: ['id'],
        databody: dataColumnNames
      },
      columnHeaders: {
        column: [
          { data: 'First Name' },
          { data: 'Last Name' },
          { data: 'Job' },
          { data: 'Salary' },
          { data: 'Salary Range' }
        ],
      },
      headerLabels: {
        row: ['Id']
      }
    });
  };

  /**
  * Helper method to format min and max salary for range presentation in table column.
  * The helper method also handles state when job description is not yet available.
  */
  PageModule.prototype.getFormattedSalaryRange = function (jobObject) {
    var range = '';
    if (jobObject.items[0] !== undefined && jobObject.items[0].minSalary !== undefined) {
      return numberConverter.format(jobObject.items[0].minSalary) + ' - ' + numberConverter.format(jobObject.items[0].maxSalary);
    }
    return '';
  };

  PageModule.prototype.getFormattedSalary = function (data) {
    return numberConverter.format(data);
  };

  PageModule.prototype.columnHeaderStyle = function (headerContext) {
    if (headerContext.index == 2) // jobTitle
    {
      return "width: 260px";
    } else if (headerContext.index == 4) // salary range
    {
      return "width: 155px;";
    }
    return "";
  };

  PageModule.prototype.getHeaderClassName = function (headerContext) {
    return getClassName(headerContext.index);
  };

  PageModule.prototype.getCellClassName = function (cellContext) {
    return getClassName(cellContext.indexes.column, cellContext.metadata.rowItem);
  };

  function getClassName(columnIndex, item) {
    if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2) {
      return "oj-sm-justify-content-flex-start";
    }
    else if (columnIndex === 3) // salary column
    {
      if (item != null && (item.data.salary === undefined ||
        item.data.salary < item.data.jobObject.items[0].minSalary ||
        item.data.salary > item.data.jobObject.items[0].maxSalary)) {
        return "oj-bg-danger-30";
      }
    }
    else if (columnIndex === 4) // salary range column
    {
      return "oj-read-only oj-bg-neutral-30";
    }
  };

  PageModule.prototype.onBeforeEdit = function (event) {
    // conditionally disable the cells for editing by preventing default on the event
    if (event.detail.cellContext.indexes.column == '4') {
      event.preventDefault();
    }
    else {
      editingInProgress = true;

      // copy the original data of this cell
      bufferredRowData = Object.assign({}, event.detail.cellContext.metadata.rowItem);
    }
  };

  PageModule.prototype.onBeforeEditEnd = function (event) {
    if (event.detail.cancelEdit == false) {
      const editable = event.target.querySelector('.editable');

      if (editable) {
        editable.validate();

        // DataGrid does not currently support editables with async validators
        // so treating editable with 'pending' state as invalid and do not allow
        // editing to end
        if (editable.valid !== 'valid') {
          event.preventDefault();
          return;
        }

        var newValue = editable.value;
        var oldValue = event.detail.cellContext.data.data;

        // from update event change the data item with latest update
        var columnIndex = event.detail.cellContext.indexes.column;
        var dataColumn = dataColumnNames[columnIndex];
        
        if (dataColumn === 'jobObject') {
           // get the data out of the select single which is in valueItem not value
          newValue = editable.valueItem.data;
          if (oldValue.items[0].id === newValue.id) {
            return; // no change in data
          }

          // if a new job is set update three row level properties
          bufferredRowData.data.job = newValue.id; 
          bufferredRowData.data.jobObject.items[0] = newValue;  // update the salary range as the job title has changed
          bufferredRowData.data.salary = undefined; // reset the salary value as the job title has changed
        }
        else {
          if (newValue === oldValue) {
            return; // no change in data
          }
          bufferredRowData.data[dataColumn] = newValue;
        }
        // write back to the cell context for immediate update
        event.detail.cellContext.data.data = bufferredRowData.data[dataColumn];
        bufferingDP.updateItem(bufferredRowData);
      }
    }

    editingInProgress = false; // mark end of editing
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

  PageModule.generateBatchSnippet = function (url, payload, operation, id) {
    return {
      id: id ? id : "someID",
      path: url,
      operation: operation,
      payload: payload ? payload : {}
    };
  };

  PageModule.prototype.isEditingCompleted = function () {
    if (editingInProgress) {
      var self = this;
      return new Promise((resolve, reject) => {
        setTimeout(function () {
          if (editingInProgress) { // invalid data in cell being edited
            reject("error");
          }
          else { // editing finished with valid value in cell
            resolve(true);
          }
        }, 500);
      }
      );
    }
    return true;
  }

  PageModule.prototype.createBatchPayload = function () {
    var isInvalidData = false;
    var payloads = [];
    var uniqueId = (new Date().getTime());
    let editItems = bufferingDP.getSubmittableItems();
    editItems.forEach(editItem => {
      // validate the record
      if (!this.validateRecord(editItem.item.data)) {
        isInvalidData = true;
        return;
      }

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

    if (isInvalidData) {
      return "error";
    }

    if (payloads.length > 0) {
      return {
        parts: payloads
      };
    }

    return "nodata";
  };

  PageModule.prototype.validateRecord = function (record) {
    if (record.firstName === undefined ||
      record.lastName === undefined ||
      record.job === undefined ||
      record.salary === undefined ||
      record.salary < record.jobObject.items[0].minSalary ||
      record.salary > record.jobObject.items[0].maxSalary) {
      return false;
    }
    return true;
  }

  PageModule.prototype.setItemStatus = function (editItem, status, error) {
    bufferingDP.setItemStatus(editItem, status, error);
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

  /**
   * Custom validator which checks that entered salary fits job's salary range.
   */
  PageModule.prototype.salaryInRangeValidator = function (record) {
    return {
      getHint: () => {
        return 'Salary has to be in job salary range';
      },
      validate: value => {
        var jobRecord = bufferredRowData.data.jobObject.items[0];
        if (jobRecord.minSalary === undefined) {
          throw new Error(
            'cannot validate because range is not available yet');
        }
        else if (value >= jobRecord.minSalary && value <= jobRecord.maxSalary) {
          return;
        }
        else {
          throw new Error('salary is out of the salary range');
        }
      }
    };
  };

  return PageModule;
});