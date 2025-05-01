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

  class TableBeforeRowAddEnd extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.event 
     */
    async run(context, { event }) {
      const { $page, $flow, $application } = context;

      const isFormValid = $page.functions.isFormValid(event, 'addRow');

      let resetBlankRecord = false;
      
      if (isFormValid && event.detail.cancelAdd === false) {
        $page.variables.nextIdValue = $page.variables.nextIdValue + 1;
        const key = $page.variables.nextIdValue;
        const recordToInsert = JSON.parse(JSON.stringify($page.variables.blankRowBuffer));
        recordToInsert.id = key;
        $page.variables.employeesBDP.instance.addItem({metadata: { key: key }, data: recordToInsert});
        resetBlankRecord = true;
      }

      if (event.detail.cancelAdd === true) {
        resetBlankRecord = true;
      }

      if (resetBlankRecord) {
        await Actions.resetVariables(context, {
          variables: [
            '$page.variables.blankRowBuffer',
          ],
        });
      }

    }
  }

  return TableBeforeRowAddEnd;
});
