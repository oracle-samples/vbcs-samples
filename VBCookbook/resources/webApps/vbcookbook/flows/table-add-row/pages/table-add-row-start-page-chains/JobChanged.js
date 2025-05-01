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

  class JobChanged extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.value 
     */
    async run(context, { value }) {
      const { $page, $flow, $application } = context;

      $page.variables.disableRowEditExit = true;

      const jobRESTResponse = await Actions.callRest(context, {
        endpoint: 'businessObjects/get_Job',
        uriParams: {
          'Job_Id': value,
        },
      });

      $page.variables.currentRowBuffer.jobObject = {
          "items": [
            jobRESTResponse.body
          ]
        };

      $page.variables.disableRowEditExit = false;
    }
  }

  return JobChanged;
});
