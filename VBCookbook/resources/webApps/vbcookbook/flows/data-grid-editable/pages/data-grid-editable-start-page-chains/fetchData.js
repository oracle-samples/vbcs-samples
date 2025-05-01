/**
 * Copyright (c)2020, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([
  'vb/action/actionChain',
  'vb/action/actions',
  'vb/action/actionUtils',
  'ojs/ojrowdatagridprovider',
  'ojs/ojbufferingdataprovider'
], (
  ActionChain,
  Actions,
  ActionUtils,
  RowDataGridProvider,
  BufferingDataProvider
) => {
  'use strict';

  class fetchData extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application } = context;

      function getRowGridDataProvider(sdp) {
        $page.variables.bufferingDP = new BufferingDataProvider(sdp);
        $page.variables.bufferingDP.addEventListener("submittableChange", (event) => {
          const submittableRows = event.detail;
          showSubmittableItems(submittableRows);
        });

        return new RowDataGridProvider.RowDataGridProvider($page.variables.bufferingDP, {
          columns: {
            rowHeader: ["id"],
            databody: $page.variables.dataColumnNames
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

      function showSubmittableItems(submittableRows) {
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

      // call getRowGridDataProvider
      const rowGridDataProvider = await getRowGridDataProvider($page.variables.employeeListSDP);
      $page.variables.data = rowGridDataProvider;
    }
  }

  return fetchData;
});
