/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define(["ojs/ojbufferingdataprovider"], function (BufferingDataProvider) {
  "use strict";

  class PageModule {
    constructor(context) {
      this.editInProgressPromise = Promise.resolve();
      this.eventHelper = context.getEventHelper();
      this.originalRowValues = {};
    }

    startEditing(rowKey) {
      this.rowBeingEditted = rowKey;
      let self = this;
      this.editInProgressPromise = new Promise((resolve, reject) => {
        self.resolveHandler = resolve;
      });
    }

    endEditing(rowKey) {
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
    }

    isEditingFinished() {
      return new Promise((resolve, reject) => {
        setTimeout(() => reject(), 500);
        this.editInProgressPromise.then(() => resolve());
      });
    }

    createBufferingDP(baseDP) {
      this.bufferingDP = new BufferingDataProvider(baseDP);
      this.bufferingDP.addEventListener("submittableChange", (event) => {
        // BufferingDataProvider fires the "submittableChange" event whenever there is a change in the number of submittable items.
        // We can use this to update the UI.
        const submittableRows = event.detail;
        this.showSubmittableItems(submittableRows);
      });
      return this.bufferingDP;
    }

    /**
     * Trigger form validation and return true if form is valid. Form in
     * this recipe is currently editted row.
     */
    isFormValid(detail, event) {
      if (detail !== undefined && detail.cancelEdit === true) {
        // skip validation
        return true;
      }
      // iterate over editable fields which are marked with "editable" class
      // and make sure they are valid:
      let table = event.target;
      if (table === undefined) {
        table = event.detail.originalEvent.target;
      }
      // debugger;
      let editables = table.querySelectorAll(".editable");
      for (let i = 0; i < editables.length; i++) {
        let editable = editables.item(i);
        editable.validate();
        // Table does not currently support editables with async validators
        // so treating editable with 'pending' state as invalid
        if (editable.valid !== "valid") {
          return false;
        }
      }
      return true;
    }

    /**
     * Newly inserted row needs to have a unique ID so that DataProvider
     * can handle it. This function generates new ID which is unique in
     * the client. This ID will be removed during Save operation as VB
     * backend assign each record unique ID according to underlying DB table.
     */
    getNextId() {
      if (this.nextIdValue === undefined) {
        this.nextIdValue = 10000;
      }
      ++this.nextIdValue;
      return this.nextIdValue;
    }

    /**
     * Helper method to format min and max salary for range presentation in table column.
     * The helper method also handles state when job description is not yet available.
     */
    getFormattedSalaryRange(currentRowBuffer, disableRowEditExit) {
      let range = "";
      if (
        currentRowBuffer.jobObject.items[0] !== undefined &&
        currentRowBuffer.jobObject.items[0].minSalary !== undefined
      ) {
        range =
          "$" +
          currentRowBuffer.jobObject.items[0].minSalary +
          " - " +
          currentRowBuffer.jobObject.items[0].maxSalary;
      }
      return disableRowEditExit ? "loading..." : range;
    }

    /**
     * Custom validator which checks that entered salary fits job's salary range.
     */
    salaryInRangeValidator(record, disableRowEditExit) {
      return {
        getHint: () => "Salary has to be in job salary range",
        validate: (value) => {
          let jobRecord = record.jobObject.items[0];
          if (jobRecord.minSalary === undefined) {
            throw new Error(
              "cannot validate because range is not available yet"
            );
          } else if (
            value >= jobRecord.minSalary &&
            value <= jobRecord.maxSalary
          ) {
            return;
          } else {
            throw new Error("salary is out of the salary range");
          }
        },
      };
    }

    areDifferent(rowKey, newValue, oldValue) {
      const originalValue = this.originalRowValues[rowKey];
      if (!originalValue) {
        this.originalRowValues[rowKey] = oldValue;
      } else {
        const same = JSON.stringify(originalValue) === JSON.stringify(newValue);
        if (same) {
          this.bufferingDP.resetUnsubmittedItem(rowKey);
          return false;
        }
      }

      let diff = JSON.stringify(newValue) !== JSON.stringify(oldValue);
      return diff;
    }

    resetOriginalRowValues() {
      this.originalRowValues = {};
    }

    generateBatchSnippet(url, payload, operation, id) {
      return {
        id: id ? id : "someID",
        path: url,
        operation: operation,
        payload: payload ? payload : {},
      };
    }

    createBatchPayload() {
      let payloads = [];
      let uniqueId = new Date().getTime();
      let editItems = this.bufferingDP.getSubmittableItems();
      editItems.forEach((editItem) => {
        let change = editItem.operation;
        let key = editItem.item.data.id;
        // clone record - some properties will be deleted from the clone:
        let record = JSON.parse(JSON.stringify(editItem.item.data));
        if (change === "remove") {
          payloads.push(
            this.generateBatchSnippet("/Employee/" + key, {}, "delete")
          );
        } else if (change === "add") {
          delete record.departmentObject;
          delete record.jobObject;
          delete record.id;
          // default some required fields:
          uniqueId = ++uniqueId;
          record.email = "person" + uniqueId + "@company.com";
          record.hireDate = new Date();
          record.department = 1;
          payloads.push(
            this.generateBatchSnippet("/Employee", record, "create")
          );
        } else if (change === "update") {
          delete record.departmentObject;
          delete record.jobObject;
          payloads.push(
            this.generateBatchSnippet(
              "/Employee/" + key,
              record,
              "update"
            )
          );
        }
      });
      return {
        parts: payloads,
      };
    }

    // Setting the status of saved items to 'submitting'
    setStatusToSubmitting() {
      let editItems = this.bufferingDP.getSubmittableItems();
      editItems.forEach((editItem) => {
        this.setItemStatus(editItem, "submitting");
      });
      return editItems;
    }

    // Setting the status of saved items to 'submitted'
    setStatusToSubmitted(submittableItems) {
      submittableItems.forEach((editItem) => {
        this.setItemStatus(editItem, "submitted");
      });
    }

    // Setting the status of saved items to 'unsubmitted'
    setStatusToUnsubmitted(unsubmittableItems) {
      unsubmittableItems.forEach((editItem) => {
        this.setItemStatus(editItem, "unsubmitted");
      });
    }

    addItem(key, data) {
      this.bufferingDP.addItem({ metadata: { key: key }, data: data });
    }

    removeItem(key, data) {
      this.bufferingDP.removeItem({ metadata: { key: key }, data: data });
    }
    updateItem(key, data) {
      this.bufferingDP.updateItem({ metadata: { key: key }, data: data });
    }

    getSubmittableItems() {
      return this.bufferingDP.getSubmittableItems();
    }

    setItemStatus(editItem, status, error) {
      this.bufferingDP.setItemStatus(editItem, status, error);
    }

    showSubmittableItems(submittableRows) {
      let textarea = document.getElementById("bufferContent");
      let textValue = "";
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
    }

    lineTableBeforeRowEdit(event) {
      let detail = event.detail;
      this.promise = event.detail.accept(
        new Promise(
          function (resolve) {
            this.rowBeforeEditPromise = resolve;
            this.eventHelper.fireCustomEvent("tableEditEvent", {
              detail: event.detail,
              name: "edit",
            });
            // reject(); when required
          }.bind(this)
        )
      );
    }

    lineTableBeforeRowEditEnd(event, preventDefault) {
      if (preventDefault) {
        event.preventDefault();
        return;
      }
      let detail = event.detail;
      event.detail.accept(
        new Promise(
          function (resolve, reject) {
            this.rowBeforeEditEndPromise = resolve;
            this.eventHelper.fireCustomEvent("tableEditEvent", {
              detail: event.detail,
              name: "editend",
            });
            // reject(); when required
          }.bind(this)
        )
      );
    }

    resolveRowBeforeEditPromise() {
      if (this.rowBeforeEditPromise) {
        this.rowBeforeEditPromise();
        delete this.rowBeforeEditPromise;
      }
    }

    resolveRowBeforeEditEndPromise() {
      if (this.rowBeforeEditEndPromise) {
        this.rowBeforeEditEndPromise();
        delete this.rowBeforeEditEndPromise;
      }
    }
  }

  return PageModule;
});
