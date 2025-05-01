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

  class getall_EmployeeFetchAction extends ActionChain {

    /**
     * @param {Object} context
     * @param {{hookHandler:'vb/RestHookHandler'}} params.configuration
     */
    async run(context, { configuration }) {
      const { $page, $flow, $application, $eq } = context;

      const response = await Actions.callRest(context, {
        endpoint: 'businessObjects/getall_Employee',
        hookHandler: configuration.hookHandler,
        requestTransformOptions: {
          filter: {
            criteria: [
              {
                attribute: 'department',
                op: '$eq',
                value: '8',
              }
            ]
          }
        },
        uriParams: {
          limit: 999,
        }
      });

      function transformData(data) {
        // as part of transforming data, lets capitalize the email id
        if (data.body.items) {
          data.body.items.forEach((element) => {
            element.email = element.email.toUpperCase();
          });
        }

        return data;
      }

      const transformDataReturn = await transformData(response);
      return transformDataReturn;
    }
  }

  return getall_EmployeeFetchAction;
});
