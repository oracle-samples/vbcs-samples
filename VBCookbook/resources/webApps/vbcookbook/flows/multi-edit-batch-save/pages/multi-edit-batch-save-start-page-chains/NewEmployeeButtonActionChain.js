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

  class NewEmployeeButtonActionChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.detail 
     */
    async run(context, { detail }) {
      const { $page, $flow, $application } = context;

      $page.variables.currentEmployee = {
        "department": $page.variables.departmentId,
        "email": "",
        "firstName": "",
        "id": $page.variables.idForNewEmployee,
        "lastName": "",
        "salary": "0"
      };
      
      $page.variables.idForNewEmployee = $page.variables.idForNewEmployee-1;

      await Actions.callChain(context, {
        chain: 'OpenDialogChain',
        params: {
          current: $page.variables.currentEmployee,
        },
      });
    }
  }

  return NewEmployeeButtonActionChain;
});
