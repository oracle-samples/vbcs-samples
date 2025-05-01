/**
 * Copyright (c)2020, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([
  'vb/action/actionChain',
  'vb/action/actions',
  'vb/action/actionUtils',
  'ojs/ojdataproviderfactory',
  'ojs/ojkeyset'
], (
  ActionChain,
  Actions,
  ActionUtils,
  DataProviderFactory,
  keySet
) => {
  'use strict';

  class initializeVariables extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {{hookHandler:'vb/RestHookHandler'}} params.configuration
     */
    async run(context, { configuration }) {
      const { $page, $flow, $application } = context;

      // initialize the key set impl for selected rows keys tracking, note that column selection 
      // can also be set here but this demo talks about row selection only
      $page.variables.selectedRows = { "row": new keySet.KeySetImpl(), "column": new keySet.KeySetImpl() };

      // initialize the enhancedDP using the departmentListSDP
      $page.variables.enhancedDP = DataProviderFactory.getEnhancedDataProvider( $page.variables.departmentListSDP, {fetchFirst : { caching: 'visitedByCurrentIterator' }});
    }
  }

  return initializeVariables;
});
