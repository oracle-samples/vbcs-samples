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

  class SelectJobValue extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.value 
     * @param {any} params.previousValue
     * @param {any} params.key 
     * @param {number} params.index 
     * @param {any} params.current 
     */
    async run(context, { value, previousValue, key, index, current }) {
      const { $page, $flow, $application } = context;

      if (value !== previousValue) {
        const getJob = await Actions.callRest(context, {
          endpoint: 'businessObjects/get_Job',
          uriParams: {
            'Job_Id': value,
          },
        });

        $page.variables.blankRowBuffer.job = getJob.body.id;
        $page.variables.blankRowBuffer.jobObject.items = [getJob.body];
      }
    }
  }

  return SelectJobValue;
});
