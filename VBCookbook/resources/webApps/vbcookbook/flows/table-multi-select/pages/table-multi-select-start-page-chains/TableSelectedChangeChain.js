/**
 * Copyright (c)2020, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([
  'vb/action/actionChain',
  'vb/action/actions',
  'vb/action/actionUtils'
], (
  ActionChain,
  Actions,
  ActionUtils
) => {
  'use strict';

  class TableSelectedChangeChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any[]} params.keys 
     * @param {any} params.selected 
     */
    async run(context, { keys, selected }) {
      const { $page, $flow, $application } = context;

      let isAllSelected = selected.row.keys.all;
      let selectedKeys = selected.row.keys.keys;
      let uncheckedKeys = selected.row.keys.deletedKeys;

      if (isAllSelected === true) {
        let selectionString = "All rows are selected.";

        // check for unselected keys
        if (uncheckedKeys.size > 0) {
          selectionString += " except rows with key : " + Array.from(uncheckedKeys).toString();
        }

        $page.variables.currentSelectionString = selectionString;
      } else if (selectedKeys.size === 0) {
        // all check box is not selected, check if any row is selected at all
        $page.variables.currentSelectionString = "Nothing selected.";
      } else {
        // only few specific rows are selected by user, get the row data for each.
        $page.variables.enhancedDP.fetchByKeys({ keys: keys }).then(fetchResult => {
          let rowsData = (fetchResult.results);

          let selectionString = "Selected rows data: ";

          rowsData.forEach(rowItem => {
            selectionString += "\n{'id':'" + rowItem.data.id;
            selectionString += "','departmentName':'" + rowItem.data.departmentName;
            selectionString += "','location':'" + rowItem.data.location;
            selectionString += "','manager':'" + rowItem.data.manager + "'}";
          });

          // optional - update the text area that shows the selection details
          $page.variables.currentSelectionString = selectionString;
        }
        );
      }
    }
  }

  return TableSelectedChangeChain;
});
