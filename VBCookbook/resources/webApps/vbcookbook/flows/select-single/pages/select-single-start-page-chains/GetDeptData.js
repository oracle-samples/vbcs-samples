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

  class GetDeptData extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application } = context;

      const response = await Actions.callRest(context, {
        endpoint: 'businessObjects/getall_Department',
      });

      if (response.ok) {
        $page.variables.departmentADP.data = response.body.items;
      } else {
        await Actions.fireNotificationEvent(context, {
          summary: response.message.summary,
        });
      }
    }
  }

  return GetDeptData;
});
