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

  class fetchRecordsAsync extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {string} params.compartmentId 
     * @param {application:TimeFilterType} params.timeFilter 
     * @param {string} params.query
     * @param {string} params.queryProperty
     */
    async run(context, { compartmentId, timeFilter, query, queryProperty}) {
      const { $fragment, $application } = context;

      $fragment.variables.isLoading = true;

      const data = await $application.functions.fetchData(compartmentId, timeFilter, query);

      if (data.error) {
        await Actions.fireNotificationEvent(context, {
          summary: 'Failed to fetch records',
          message: data.message
        });

        $fragment.variables.adp.data = [];

      } else {

        $fragment.variables.adp.data = data.body.items;
        
      }

      $fragment.variables.isLoading = false;

    }

  }

  return fetchRecordsAsync;
});
