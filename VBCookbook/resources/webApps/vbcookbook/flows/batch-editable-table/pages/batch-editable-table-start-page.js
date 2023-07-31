/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define(["vb/helpers/rest", "ojs/ojdatacollection-utils"], function (
  RestHelper,
  DataCollectionEditUtils
) {
  "use strict";

  class PageModule {
    constructor() {}

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
    getNextId(empArray) {
      if (this.nextIdValue === undefined) {
        this.nextIdValue = 1000000;
        empArray.forEach((e) => {
          if (e.id > this.nextIdValue) this.nextIdValue = e.id;
        });
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

    generateBatchSnippet(url, payload, operation, id) {
      return {
        id: id ? id : "someID",
        path: url,
        operation: operation,
        payload: payload ? payload : {},
      };
    }

    /**
     * Create payload for Batch BO REST call, that is for one REST call which contains
     * multiple changes to be persited in one transaction.
     */
    createBatchPayload(empArray, rowStatus) {
      let payloads = [];
      let record;
      let uniqueId = new Date().getTime();
      Object.keys(rowStatus).forEach((keyParam) => {
        let change = rowStatus[keyParam];
        let key = parseInt(keyParam,10);
        if (change === "deleted") {
          payloads.push(
            this.generateBatchSnippet("/Employee/" + key, {}, "delete")
          );
        } else if (change === "inserted") {
          record = empArray.find((e) => e.id === key);
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
        } else if (change === "modified") {
          record = empArray.find((e) => e.id === key);
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

    areDifferent(oldValue, newValue) {
      if (JSON.stringify(newValue) === JSON.stringify(oldValue)) return false;
      else return true;
    }
  }

  return PageModule;
});
