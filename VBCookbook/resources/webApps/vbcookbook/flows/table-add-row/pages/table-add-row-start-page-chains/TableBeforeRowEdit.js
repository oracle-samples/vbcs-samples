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

  class TableBeforeRowEdit extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.event 
     */
    async run(context, { rowKey, rowIndex, rowData }) {
      const { $page, $flow, $application } = context;

      const callFunctionResult = await $page.functions.startEditing(rowKey);

      $page.variables.currentRowBuffer = rowData;

      $page.variables.isCurrentRowBeingDeleted = false;
    }
  }

  return TableBeforeRowEdit;
});
