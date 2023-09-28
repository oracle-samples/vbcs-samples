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

  class FragmentClickedChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {string} params.value 
     */
    async run(context, { value }) {
      const { $page, $flow, $application } = context;

      const navigateToPageMainPage2Result = await Actions.navigateToPage(context, {
        page: 'detail',
        params: {
          timeEnd: $page.variables.timeFilter.timeEnd,
          timeStart: $page.variables.timeFilter.timeStart,
          timeZone: $page.variables.timeFilter.timeZone,
        },
      });
    }
  }

  return FragmentClickedChain;
});
