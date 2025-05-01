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

  class TableBeforeRowEditEnd extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.cancelEdit 
     * @param {any} params.rowKey 
     * @param {number} params.rowIndex 
     * @param {any} params.rowData 
     * @param {EmployeeType} params.currentRowBuffer 
     * @param {any} params.event 
     */
    async run(context, { cancelEdit, rowKey, rowIndex, rowData, currentRowBuffer, event }) {
      const { $page, $flow, $application } = context;

      let rowDataForWorkaround = currentRowBuffer;

      if (!$page.variables.disableRowEditExit && $page.functions.isFormValid(event)) {
        let refetchRowDataWorkaroundNeeded = false;

        if (cancelEdit) {
          // work around needed when no changes were made:
          refetchRowDataWorkaroundNeeded = true;
          // update row with original row data:
          rowDataForWorkaround = rowData;
        } else if (!$page.variables.isCurrentRowBeingDeleted) {

          const rowHasChanged = await this.areDifferent(context, { key: rowKey, newRow: currentRowBuffer, oldRow: rowData });

          if (rowHasChanged) {
            await $page.variables.employeesBDP.instance.updateItem({ metadata: { key: rowKey}, data: currentRowBuffer});

            $page.variables.noChangesToSave = false;
          } else {
            // work around needed when no changes were made:
            refetchRowDataWorkaroundNeeded = true;
          }
            
        }

        if (refetchRowDataWorkaroundNeeded) {
          // VBS-28095 workaround:
          // workaround for BPD bug which updates current row data but removes referenced jobObject.
          // this step re-updates the row with correct values (including jobObject reference)
          const fireEventWorkaroundVBS28095Result = await Actions.fireEvent(context, {
            event: 'WorkaroundVBS28095',
            payload: {
              record: rowDataForWorkaround,
            },
          });
        }
        await $page.functions.endEditing(rowKey);
      }

    }

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {number} params.key 
     * @param {EmployeeType} params.oldRow 
     * @param {EmployeeType} params.newRow 
     */
    async areDifferent(context, { key, newRow, oldRow }) {
      const { $page, $flow, $application } = context;

      const areEqual = function(o1, o2) {
        return JSON.stringify(o1, Object.keys(o1).sort()) === JSON.stringify(o2, Object.keys(o2).sort());
      };

      if ($page.variables.originalRowValues === undefined) {
        $page.variables.originalRowValues = {};
      }
      const originalValue = $page.variables.originalRowValues[key];
      if (!originalValue) {
        $page.variables.originalRowValues[key] = oldRow;
      } else {
        const same = areEqual(originalValue, newRow);
        if (same) {
          // latest changes match the original row values:
          // revent the change from BDP
          $page.variables.employeesBDP.instance.resetUnsubmittedItem(key);
          return false;
        }
      }

      return !areEqual(newRow, oldRow);
    }

  }

  return TableBeforeRowEditEnd;
});
