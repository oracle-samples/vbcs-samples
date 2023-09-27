/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([
  "ojs/ojrowdatagridprovider",
  "ojs/ojbufferingdataprovider",
  "ojs/ojconverter-number",
], (RowDataGridProvider, BufferingDataProvider, NumberConverter) => {
  "use strict";

  class PageModule {
    constructor() {
      this.dataColumnNames = [
        "firstName",
        "lastName",
        "jobObject",
        "salary",
        "jobObject",
        "review"
      ];
      this.editingInProgress = false; // keeps track if editing is going on
      this.numberConverter = new NumberConverter.IntlNumberConverter({
        style: "currency",
        currency: "USD",
        currencyDisplay: "symbol",
        maximumFractionDigits: 0,
      });
    }

    /**
     *
     * @param {String} sdp
     * @return {String}
     */
    getRowGridDataProvider(sdp) {
      this.bufferingDP = new BufferingDataProvider(sdp);
      this.bufferingDP.addEventListener("submittableChange", (event) => {
        const submittableRows = event.detail;
        this.showSubmittableItems(submittableRows);
      });

      return new RowDataGridProvider.RowDataGridProvider(this.bufferingDP, {
        columns: {
          rowHeader: ["id"],
          databody: this.dataColumnNames,
        },
        columnHeaders: {
          column: [
            { data: "First Name" },
            { data: "Last Name" },
            { data: "Job" },
            { data: "Salary" },
            { data: "Salary Range" },
            { data: "Review Needed"}
          ],
        },
        headerLabels: {
          row: ["Id"],
        },
      });
    }

    /**
     * Helper method to format min and max salary for range presentation in table column.
     * The helper method also handles state when job description is not yet available.
     */
    getFormattedSalaryRange(jobObject) {
      let range = "";
      if (
        jobObject.items[0] !== undefined &&
        jobObject.items[0].minSalary !== undefined
      ) {
        return (
          this.numberConverter.format(jobObject.items[0].minSalary) +
          " - " +
          this.numberConverter.format(jobObject.items[0].maxSalary)
        );
      }
      return "";
    }

    getFormattedSalary(data) {
      return this.numberConverter.format(data);
    }

    columnHeaderStyle(headerContext) {
      if (headerContext.index === 2) { // jobTitle
        return "width: 240px";
      } else if (headerContext.index === 4) { // salary range
        return "width: 155px;";
      } else if (headerContext.index === 3) { // salary
        return "max-width: 80px;";
      }
      return "";
    }

    getHeaderClassName(headerContext) {
      return this.getClassName(headerContext.index);
    }

    getCellClassName(cellContext) {
      return this.getClassName(
        cellContext.indexes.column,
        cellContext.metadata.rowItem
      );
    }

    getClassName(columnIndex, item) {
      if (columnIndex === 0 || columnIndex === 1 || columnIndex === 2 || columnIndex === 5) {
        return "oj-sm-justify-content-flex-start";
      } else if (columnIndex === 3) {
        // salary column
        if (
          item !== null && item !== undefined &&
          (item.data.salary === undefined ||
            item.data.salary < item.data.jobObject.items[0].minSalary ||
            item.data.salary > item.data.jobObject.items[0].maxSalary)
        ) {
          return "oj-bg-danger-30";
        }
      } else if (columnIndex === 4) {
        // salary range column
        return "oj-read-only oj-bg-neutral-30";
      }
    }

    onBeforeEdit(event) {
      // conditionally disable the cells for editing by preventing default on the event
      if (event.detail.cellContext.indexes.column === 4 || event.detail.cellContext.indexes.column === 5) {
        event.preventDefault();
      } else {
        this.editingInProgress = true;

        // copy the original data of this cell
        this.bufferredRowData = Object.assign(
          {},
          event.detail.cellContext.metadata.rowItem
        );
      }
    }

    onBeforeEditEnd(event) {
      if (event.detail.cancelEdit === false) {
        const editable = event.target.querySelector(".editable");

        if (editable) {
          editable.validate();

          // DataGrid does not currently support editables with async validators
          // so treating editable with 'pending' state as invalid and do not allow
          // editing to end
          if (editable.valid !== "valid") {
            event.preventDefault();
            return;
          }

          let newValue = editable.value;
          let oldValue = event.detail.cellContext.data.data;

          // from update event change the data item with latest update
          let columnIndex = event.detail.cellContext.indexes.column;
          let dataColumn = this.dataColumnNames[columnIndex];

          if (dataColumn === "jobObject") {
            // get the data out of the select single which is in valueItem not value
            newValue = editable.valueItem.data;
            if (oldValue.items[0].id === newValue.id) {
              return; // no change in data
            }

            // if a new job is set update three row level properties
            this.bufferredRowData.data.job = newValue.id;
            this.bufferredRowData.data.jobObject.items[0] = newValue; // update the salary range as the job title has changed
            this.bufferredRowData.data.salary = undefined; // reset the salary value as the job title has changed
          } else {
            if (newValue === oldValue) {
              return; // no change in data
            }
            this.bufferredRowData.data[dataColumn] = newValue;
          }
          // write back to the cell context for immediate update
          event.detail.cellContext.data.data =
            this.bufferredRowData.data[dataColumn];
          this.bufferingDP.updateItem(this.bufferredRowData);
        }
      }

      this.editingInProgress = false; // mark end of editing
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

    generateBatchSnippet(url, payload, operation, id) {
      return {
        id: id ? id : "someID",
        path: url,
        operation: operation,
        payload: payload ? payload : {},
      };
    }

    isEditingCompleted() {
      if (this.editingInProgress) {
        let self = this;
        return new Promise((resolve, reject) => {
          setTimeout(function () {
            if (this.editingInProgress) {
              // invalid data in cell being edited
              reject("error");
            } else {
              // editing finished with valid value in cell
              resolve(true);
            }
          }, 500);
        });
      }
      return true;
    }

    createBatchPayload() {
      let isInvalidData = false;
      let payloads = [];
      let uniqueId = new Date().getTime();
      let editItems = this.bufferingDP.getSubmittableItems();
      editItems.forEach((editItem) => {
        // validate the record
        if (!this.validateRecord(editItem.item.data)) {
          isInvalidData = true;
          return;
        }

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

      if (isInvalidData) {
        return "error";
      }

      if (payloads.length > 0) {
        return {
          parts: payloads,
        };
      }

      return "nodata";
    }

    validateRecord(record) {
      if (
        record.firstName === undefined ||
        record.lastName === undefined ||
        record.job === undefined ||
        record.salary === undefined ||
        record.salary < record.jobObject.items[0].minSalary ||
        record.salary > record.jobObject.items[0].maxSalary
      ) {
        return false;
      }
      return true;
    }

    setItemStatus(editItem, status, error) {
      this.bufferingDP.setItemStatus(editItem, status, error);
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

    /**
     * Custom validator which checks that entered salary fits job's salary range.
     */
    salaryInRangeValidator(record) {
      return {
        getHint: () => "Salary has to be in job salary range",
        validate: (value) => {
          let jobRecord = this.bufferredRowData.data.jobObject.items[0];
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

    updateReview(rowData) {
      this.bufferingDP.updateItem({ data: rowData, metadata: { key: rowData.id } });
    }
  }

  return PageModule;
});
