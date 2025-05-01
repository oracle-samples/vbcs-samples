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

  class UpdateEmployeeChain extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application } = context;

      $page.variables.isSaveDisabled = true;

      const response = await Actions.callRest(context, {
        endpoint: 'businessObjects/update_Employee',
        uriParams: {
          'Employee_Id': $page.variables.employee.id,
        },
        body: $page.variables.employee,
      });

      if (!response.ok) {
        await Actions.fireNotificationEvent(context, {
        summary: response.message.summary,
        message: 'Record update failed.',
        type: 'error',
        });
      } else {
        await Actions.fireNotificationEvent(context, {
          summary: 'Success!',
          message: 'Record updated successfully.',
          type: 'confirmation',
        });
      }

      $page.variables.isSaveDisabled = false;
    }
  }

  return UpdateEmployeeChain;
});
