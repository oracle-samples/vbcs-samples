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

  class fetchEmployees extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application, $chain } = context;

      const response = await Actions.callRest(context, {
        endpoint: 'businessObjects/getall_Department',
        uriParams: {
          expand: 'employeeCollection',
          limit: 10,
        },
      });

      if (!response.ok) {
          await Actions.fireNotificationEvent(context, {
            summary: response.message.summary,
          });
      } else {
        $page.variables.departmentArray = response.body.items;

        const buildDept = await $page.functions.buildDept($page.variables.departmentArray);

        $page.variables.departmentTree = buildDept;
      }
    }
  }

  return fetchEmployees;
});
