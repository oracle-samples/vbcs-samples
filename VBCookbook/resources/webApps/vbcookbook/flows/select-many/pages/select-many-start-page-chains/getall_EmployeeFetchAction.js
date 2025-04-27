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
    async run(context, { configuration } ) {
      const { $page, $flow, $application } = context;

      const response = await Actions.callRest( context, {
        endpoint: 'businessObjects/getall_Employee',
        hookHandler: configuration.hookHandler,
        requestTransformFunctions: {
          filter: $page.functions.processFilter
        }
      });

      // this function adds a new field fullName in data
      function customizeData(restResponse) {
        if (restResponse.body.items.length > 0) {
          restResponse.body.items.forEach(function (item) {
            item.fullName = item.firstName + " " + item.lastName;
          });
        }
        return restResponse;
      }

      if (response.ok) {
        const customizeDataReturn = await customizeData(response);
        return customizeDataReturn;
      }
    }
  }

  return getall_EmployeeFetchAction;
});