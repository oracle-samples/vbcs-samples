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

  class FetchEmployees extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application, $chain } = context;

      await Actions.resetVariables(context, {
        variables: [
          '$page.variables.rowStatus',
          '$page.variables.employeeListADP',
        ],
      });

      const response = await Actions.callRest(context, {
        endpoint: 'businessObjects/getall_Employee',
        uriParams: {
          q: "department=" + $page.variables.departmentId
        },
      });

      if (!response.ok) {
          await Actions.fireNotificationEvent(context, {
            summary: response.message.summary,
          });
      } else {
        $page.variables.employeeListADP.data = response.body.items;
      }
    }
  }

  return FetchEmployees;
});
