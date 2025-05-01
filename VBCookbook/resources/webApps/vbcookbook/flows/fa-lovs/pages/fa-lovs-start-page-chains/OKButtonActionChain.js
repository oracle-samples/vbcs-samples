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

  class OKButtonActionChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.detail 
     */
    async run(context, { detail }) {
      const { $page, $flow, $application } = context;

      if ($page.variables.selectedRow.key) {
        $page.variables.selectedEmployee = {
          "data": {
            "firstName": $page.variables.selectedRow.data.firstName,
            "id": $page.variables.selectedRow.key,
            "lastName": $page.variables.selectedRow.data.lastName
          },
          "metadata": {
            "key": $page.variables.selectedRow.key
          },
          "key": $page.variables.selectedRow.key
        };
      }

      const advancedSearchOjDialogClose = await Actions.callComponentMethod(context, {
        selector: '#advanced-search-oj-dialog',
        method: 'close',
      });

      await Actions.resetVariables(context, {
        variables: [
          '$page.variables.AdvanceSearchEmployeeListSDP.filterCriterion',
          '$page.variables.selectedRow',
          '$page.variables.filters',
        ],
      });
    }
  }

  return OKButtonActionChain;
});
