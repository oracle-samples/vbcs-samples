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

  class openEditEmployeeChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.current 
     */
    async run(context, { current }) {
      const { $page, $flow, $application } = context;

      $page.variables.currentEmployee = current.row;

      await Actions.resetVariables(context, {
        variables: [
          '$page.variables.currentSkills'
        ]
      });
      
      current.row.skillCollection.items.forEach(element => {
        $page.variables.currentSkills.push(element.id);
      });

      const dialogEditEmployeeOpen = await Actions.callComponentMethod(context, {
        selector: '#dialog-edit-employee',
        method: 'open'
      });
    }
  }

  return openEditEmployeeChain;
});
