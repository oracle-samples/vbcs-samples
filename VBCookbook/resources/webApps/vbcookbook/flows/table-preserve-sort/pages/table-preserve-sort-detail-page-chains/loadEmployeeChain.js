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
     */
    async run(context) {
      const { $page, $flow, $application, $constants, $variables } = context;

      const callRestResult = await Actions.callRest(context, {
        endpoint: 'businessObjects/get_Employee',
        responseType: 'getEmployeeResponse',
        uriParams: {
          'Employee_Id': $page.variables.employeeId,
        },
      }, { id: 'loadEmployee' });

      if (!callRestResult.ok) {
        await Actions.fireNotificationEvent(context, {
          message: 'Could not load data: status ' + callRestResult.status,
          displayMode: 'persist',
          type: 'error',
          summary: 'Could not load data',
        }, { id: 'fireErrorNotification' });

        return;
      }

      $page.variables.employee = callRestResult.body;
    }
  }

  return loadEmployeeChain;
});
