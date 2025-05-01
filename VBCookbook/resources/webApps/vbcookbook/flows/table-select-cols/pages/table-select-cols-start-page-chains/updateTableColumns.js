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

  class updateTableColumns extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {object} params.event 
     */
    async run(context, { event }) {
      const { $page, $flow, $application, $variables } = context;

      $page.variables.columns = $page.variables.columnOptions.filter(function(col) { return event.value.find(function(selectedItem) { return col.field === selectedItem;}); });
    }
  }

  return updateTableColumns;
});
