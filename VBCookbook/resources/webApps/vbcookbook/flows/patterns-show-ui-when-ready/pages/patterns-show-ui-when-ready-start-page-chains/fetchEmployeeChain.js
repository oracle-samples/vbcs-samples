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

  class fetchEmployeeChain extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application, $chain } = context;

      function sleep() {
        return new Promise((resolve) => {
          setTimeout(() => resolve(), 1500);
        });
      }

      const response = await Actions.callRest(context, {
        endpoint: 'businessObjects/getall_Employee',
        uriParams: {
          limit: '1',
        },
      });

      if (response.ok) {
        $page.variables.employee = response.body.items[0];

        await sleep();

        $page.variables.pageReady = true;
      } else {
        await Actions.fireNotificationEvent(context, {
          summary: response.message.summary,
        });
      }
    }
  }

  return fetchEmployeeChain;
});
