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

  class FetchDepartment extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application, $chain } = context;

      const response = await Actions.callRest(context, {
        endpoint: 'businessObjects/get_Department',
        uriParams: {
          'Department_Id': $page.variables.departmentId
        },
      });

      if (!response.ok) {
          await Actions.fireNotificationEvent(context, {
            summary: response.message.summary,
          });
      } else {
        $page.variables.originalDepartmentName = response.body.departmentName;
        $page.variables.departmentName = response.body.departmentName;

        await Actions.callChain(context, {
          chain: 'FetchEmployees',
        });
      }
    }
  }

  return FetchDepartment;
});
