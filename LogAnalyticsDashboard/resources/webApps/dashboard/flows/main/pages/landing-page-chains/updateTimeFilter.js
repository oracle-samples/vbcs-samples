/**
 * Copyright (c)2023 Oracle and/or its affiliates.
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

  class updateTimeFilter extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {{oldValue:any,value:any}} params.event 
     */
    async run(context, { event }) {
      const { $page, $flow, $application } = context;

      await Actions.assignVariable(context, {
        variable: '$page.variables.timeFilter',
        value: $page.variables.filterValueItemRecord.data,
        reset: 'empty',
      });

      await Actions.fireDataProviderEvent(context, {
        target: $page.variables.labelFilterSDP,
        refresh: null,
      });
    }
  }

  return updateTimeFilter;
});
