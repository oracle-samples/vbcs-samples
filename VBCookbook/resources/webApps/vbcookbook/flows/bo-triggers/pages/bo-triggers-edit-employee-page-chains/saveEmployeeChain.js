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
     * @param {Object} context
     * @param {Object} params
     */
    async run(context) {
      const { $page, $flow, $application, $chain } = context;

      $page.variables.saveEmployeeChainInProgress = true;

      let validationResult = await Actions.callChain(context, {
        chain: 'flow:validateFormChain',
        params: {
          validationGroupId: 'validation-group'
        },
      });

      if (validationResult) {
        let saveHeaders = {};
        let response;
        if ($page.variables.employeeETag) {
          saveHeaders = { 'If-Match': $page.variables.employeeETag };
          response = await Actions.callRest(context, {
            endpoint: 'businessObjects/update_Employee',
            uriParams: {
              'Employee_Id': $page.variables.employeeId,
            },
            body: $page.variables.employee,
            headers : saveHeaders
          });
        } else {
          response = await Actions.callRest(context, {
            endpoint: 'businessObjects/update_Employee',
            uriParams: {
              'Employee_Id': $page.variables.employeeId,
            },
            body: $page.variables.employee
          });
        }

        if (!response.ok) {
          await Actions.fireNotificationEvent(context, {
            summary: 'Save failed',
            message: 'Could not update Employee: status ' + response.status + ":" + response.statusText
          });
        } else {
          $page.variables.employee = response.body;
          $page.variables.employeeETag = response.headers.get('ETag');

          await Actions.fireNotificationEvent(context, {
            summary: 'Employee saved',
            message: 'Employee record successfully updated',
            displayMode: 'transient',
            type: 'confirmation',
          });

          await Actions.callChain(context, {
            chain: 'goBackChain',
          });
        }
      }

      $page.variables.saveEmployeeChainInProgress = false;
    }
  }

  return saveEmployeeChain;
});
