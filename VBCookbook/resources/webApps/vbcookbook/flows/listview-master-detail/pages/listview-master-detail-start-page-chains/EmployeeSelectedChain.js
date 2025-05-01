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

  class EmployeeSelectedChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any[]} params.keys 
     */
    async run(context, { keys }) {
      const { $page, $flow, $application, $chain } = context;

      $page.variables.selectedEmployee = keys[0];

      if ($page.variables.selectedEmployee === null) {
        await Actions.resetVariables(context, {
          variables: [
            '$page.variables.employee',
          ],
        });
      } else {
        const response = await Actions.callRest(context, {
          endpoint: 'businessObjects/get_Employee',
          uriParams: {
            'Employee_Id': $page.variables.selectedEmployee,
          },
        });

        if (!response.ok) {
            await Actions.fireNotificationEvent(context, {
              summary: response.message.summary,
            });
        } else {
          $page.variables.employee = response.body;
        }
      }
    }
  }

  return EmployeeSelectedChain;
});
