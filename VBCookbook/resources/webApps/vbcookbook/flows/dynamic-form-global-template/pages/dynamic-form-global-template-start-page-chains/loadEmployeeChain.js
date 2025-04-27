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

  class loadEmployeeChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {string} params.employeeId 
     * @param {any[]} params.fetchedFields 
     */
    async run(context, { employeeId = '100', fetchedFields }) {
      const { $page, $flow, $application, $variables, $response } = context;

      $page.variables.employeeDetailFormLoadingStatus = 'pending';

      await Actions.resetVariables(context, {
        variables: [
          '$page.variables.employee',
        ],
      });

      if ( fetchedFields && fetchedFields.length && employeeId !== undefined ) {
        const response = await Actions.callRest(context, {
          endpoint: 'businessObjects/get_Employee',
          uriParams: {
            'Employee_Id': employeeId,
          },
        }, { id: 'loadEmployeeRecord' });

        if (!response.ok) {
          await Actions.fireNotificationEvent(context, {
            summary: 'Could not load data',
            message: 'Could not load data: status ' + response.statusText + '(' + response.status + ')',
          });
        
          return;
        } else {
          $page.variables.employee = response.body;
          $page.variables.employeeDetailFormLoadingStatus = 'ready';
        }
      }
    }
  }

  return loadEmployeeChain;
});
