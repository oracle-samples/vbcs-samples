/**
 * Copyright (c)2020, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([
  'vb/action/actionChain',
  'vb/action/actions',
  'vb/action/actionUtils',
  "vb/BusinessObjectsTransforms",
], (
  ActionChain,
  Actions,
  ActionUtils,
  BOTransforms
) => {
  'use strict';

  class getall_EmployeeFetch extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {{hookHandler:'vb/RestHookHandler'}} params.configuration
     */
    async run(context, { configuration }) {
      const { $page, $flow, $application } = context;

      const callRestEndpoint1 = await Actions.callRest(context, {
        endpoint: 'businessObjects/getall_Employee',
        responseType: 'getallEmployeeResponse',
        hookHandler: configuration.hookHandler,
        requestType: 'json',
        requestTransformFunctions: {
          select: await this.createCustomSelectFunction(context),
        },
        requestTransformOptions: {
          sort: [
            {
              attribute: 'firstName',
            },
          ],
        }
      });

      return callRestEndpoint1;
    }

    async createCustomSelectFunction(context) {
      const { $page, $flow, $application } = context;

      const fieldsToFetch = await $page.metadata.businessObjectsGetEmployeeMetadata.provider.getFieldsToFetch({layout:["employeeListViewLayout"]});
      
      const customSelect = function(configuration, options, transformsContext) {
        options.attributes = fieldsToFetch;
          const newCfg = BOTransforms.request.select(configuration, options);
          return newCfg;
      };

      return customSelect;
    }

  }

  return getall_EmployeeFetch;
});
