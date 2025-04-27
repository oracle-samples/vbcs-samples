/**
 * Copyright (c)2020, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([
  'vb/action/actionChain',
  'vb/action/actions',
  'vb/action/actionUtils',
], (
  ActionChain,
  Actions,
  ActionUtils
) => {
  'use strict';

  class AddChangesListener extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application } = context;

      $page.variables.employeesBDP.instance.addEventListener("submittableChange", (event) => {
        // BufferingDataProvider fires the "submittableChange" event whenever there 
        // is a change in the number of submittable items.
        // We can use this to update the UI.
        const submittableRows = event.detail;
        const textarea = document.getElementById("bufferContent");
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
      });
      
    }
  }

  return AddChangesListener;
});
