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
      const { $page, $flow, $application, $constants, $variables, $chain } = context;

      const response = await Actions.callRest(context, {
        endpoint: 'businessObjects/update_Employee',
        uriParams: {
          'Employee_Id': $variables.currentEmployee.id,
        },
        body: $variables.currentEmployee,
      }, { id: 'callRestUpdateEmployee' });

      if (!response.ok) {
        await Actions.fireNotificationEvent(context, {
          summary: response.message.summary,
        });
      } else {
        await Actions.fireNotificationEvent(context, {
          type: 'confirmation',
          summary: 'Record updated succesfully!',
          message: 'Record updated succesfully!',
        });

        await Actions.callChain(context, {
          chain: 'CloseDialogActionChain',
        });

        await Actions.fireDataProviderEvent(context, {
          refresh: null,
          target: $variables.employeeListSDP,
        });
      }
    }
  }

  return UpdateEmployeeChain;
});
