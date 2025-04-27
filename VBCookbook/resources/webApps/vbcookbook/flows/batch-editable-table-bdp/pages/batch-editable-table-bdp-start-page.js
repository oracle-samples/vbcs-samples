/**
 * Copyright (c)2020, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([], function () {
  "use strict";

  class PageModule {
    
    constructor(context) {
      this.editInProgressPromise = Promise.resolve();
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
        // to ignore endEditing if it is NOT for row being currently edited - such
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

    /**
     * Trigger form validation and return true if form is valid. Form in
     * this recipe is currently editted row.
     */
    isFormValid(event) {
      const detail = event.detail;
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

  }

  return PageModule;
});
