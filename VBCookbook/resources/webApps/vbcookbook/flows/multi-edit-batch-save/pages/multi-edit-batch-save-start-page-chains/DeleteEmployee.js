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

  class DeleteEmployee extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.current 
     * @param {any} params.detail 
     * @param {number} params.index 
     * @param {any} params.key 
     */
    async run(context, { current, detail, index, key }) {
      const { $page, $flow, $application } = context;

      $page.variables.currentEmployee = current;

      await Actions.fireDataProviderEvent(context, {
        target: $page.variables.employeeListADP,
        remove: {
          keys: [ $page.variables.currentEmployee.id ]
        },
      });

      if ($page.variables.rowStatus[$page.variables.currentEmployee.id] === "inserted") {
        $page.variables.rowStatus[$page.variables.currentEmployee.id] = 'ignore';
      } else {
        $page.variables.rowStatus[$page.variables.currentEmployee.id] = 'deleted';
      }
    }
  }

  return DeleteEmployee;
});
