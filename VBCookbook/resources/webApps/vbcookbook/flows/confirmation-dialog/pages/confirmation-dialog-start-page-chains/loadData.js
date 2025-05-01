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

  class loadData extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application } = context;

      const results = await Promise.all([
        async () => {

          const response = await Actions.callRest(context, {
            endpoint: 'businessObjects/get_Employee',
            uriParams: {
              'Employee_Id': '100',
            },
          });

          $page.variables.cleanEmp = response.body;
          $page.variables.formEmp = response.body;
        },
        async () => {

          const response2 = await Actions.callRest(context, {
            endpoint: 'businessObjects/get_Department',
            uriParams: {
              'Department_Id': '4',
            },
          });

          $page.variables.cleanDept = response2.body;
          $page.variables.formDept = response2.body;
        },
      ].map(sequence => sequence()));
    }
  }

  return loadData;
});
