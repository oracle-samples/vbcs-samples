/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define(['ojs/ojbufferingdataprovider'], function (BufferingDataProvider) {
  'use strict';

  class PageModule {
  }

  //var bufferingDP;
  PageModule.prototype.createBufferingDP = function (baseDP) {
    this.bufferingDP = new BufferingDataProvider(baseDP);
    this.bufferingDP.addEventListener("submittableChange", (event) => {
      // BufferingDataProvider fires the "submittableChange" event whenever there is a change in the number of submittable items.
      // We can use this to update the UI.
      const submittableRows = event.detail;
      this.showSubmittableItems(submittableRows);
    });
    return this.bufferingDP;
  };
  

  PageModule.prototype.showSubmittableItems = function (submittableRows) {
    let textarea = document.getElementById("bufferContent");
    var textValue = "";
    submittableRows.forEach((editItem) => {
      textValue += "Operation: " + editItem.operation + ", ";
      textValue += "Row ID: " + editItem.item.metadata.key;
      if (editItem.item.metadata.message) {
        textValue +=
          " error: " + JSON.stringify(editItem.item.metadata.message);
      }
      textValue += "\n";
    });
    textarea.value = textValue;
  };


  PageModule.prototype.resetChanges = function () {
    this.bufferingDP.resetAllUnsubmittedItems();
  }


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
    let editItems = this.bufferingDP.getSubmittableItems();
    editItems.forEach(editItem => {
      var change = editItem.operation;
      var key = editItem.item.metadata.key;
      // clone record - some properties will be deleted from the clone:
      var record = JSON.parse(JSON.stringify(editItem.item.data));
      if (change === 'remove') {
        payloads.push(PageModule.generateBatchSnippet("/Employee/" +
          key, {}, 'delete'));
      } else if (change === 'add') {
        //delete record.departmentObject;
        //delete record.jobObject;
        //delete record.id;
        // default some required fields:
       // record.email = 'person' + (++uniqueId) + '@company.com';
        record.hireDate = new Date();
        record.department = 1;
        record.job = 1;
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
    let editItems = this.bufferingDP.getSubmittableItems();
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

  PageModule.prototype.setItemStatus = function (editItem, status, error) {
    this.bufferingDP.setItemStatus(editItem, status, error);
  };


  return PageModule;
});
