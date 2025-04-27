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

  class DeleteRow extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {number} params.key 
     * @param {EmployeeType} params.row 
     */
    async run(context, { key, row }) {
      const { $page, $flow, $application } = context;

      $page.variables.isCurrentRowBeingDeleted = true;

      $page.variables.noChangesToSave = false;

      $page.variables.employeesBDP.instance.removeItem({metadata: {key: key}, data: row});
    }
  }

  return DeleteRow;
});
