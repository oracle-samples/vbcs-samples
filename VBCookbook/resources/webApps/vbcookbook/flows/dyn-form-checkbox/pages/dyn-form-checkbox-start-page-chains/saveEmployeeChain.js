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

  class saveEmployeeChain extends ActionChain {

    /**
     * Saves Employee record data
     * @param {Object} context
     * @param {Object} params
     * @param {string} params.employeeId 
     */
    async run(context, { employeeId = '100' }) {
      const { $page, $flow, $application } = context;

      await Actions.fireNotificationEvent(context, {
        type: 'confirmation',
        summary: "Changes to be saved: "  
        + 'First Name: '+ $page.variables.employee.firstName + ', '
         + "Last Name: "+ $page.variables.employee.lastName  + ', '
          + "Safety and Wellbing: "+ $page.variables.employee.safetyTraining + ', '
           + "Code of Ethics: "+ $page.variables.employee.ethicalTraining + ', '
            + "Security Training: "+ $page.variables.employee.securityTraining
      });
    }

   

  }

  return saveEmployeeChain;
});
