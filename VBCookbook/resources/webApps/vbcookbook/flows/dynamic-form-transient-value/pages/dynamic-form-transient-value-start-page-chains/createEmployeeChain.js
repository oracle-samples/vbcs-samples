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

  class createEmployeeChain extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application } = context;

      $page.variables.createEmployeeChainInProgress = true;

      let chainResult = await Actions.callChain(context, {
        chain: 'flow:validateFormChain',
        params: {
          validationGroupId: 'employee-validation-group--1209804167-1',
        },
      });

      if (chainResult) {
        const response = await Actions.callRest(context, {
          endpoint: 'businessObjects/create_Employee',
          body: $page.variables.employee
        });

        if (response.ok) {
          await Actions.fireNotificationEvent(context, {
            message: 'Employee record successfully created with details: ' + JSON.stringify($page.variables.employee),
            displayMode: 'transient',
            type: 'confirmation',
            summary: 'Employee saved.',
          });

          await Actions.callChain(context, {
            chain: 'clearEmployeeChain',
          });
        }
        else {
          // the error details will be in body
          let errorDetails = "Employee record creation failed.";

          if ( response.body['o:errorDetails'] && response.body['o:errorDetails'].length > 0 )
          {
            errorDetails = JSON.stringify(response.body['o:errorDetails']);
          }

          await Actions.fireNotificationEvent(context, {
            message: errorDetails,
            displayMode: 'transient',
            type: 'error',
            summary: 'Employee save failed : ' + response.body.title,
          });
        }
      }
      else {
        await Actions.fireNotificationEvent(context, {
          message: 'Please provide valid data.',
          displayMode: 'transient',
          type: 'warning',
          summary: 'Invalid data.',
        });
      }

      $page.variables.createEmployeeChainInProgress = false;
    }
  }

  return createEmployeeChain;
});
