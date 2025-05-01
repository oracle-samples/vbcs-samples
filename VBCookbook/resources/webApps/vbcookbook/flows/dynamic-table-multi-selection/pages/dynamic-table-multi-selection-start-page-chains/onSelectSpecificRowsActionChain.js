/**
 * Copyright (c)2020, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([
  'vb/action/actionChain',
  'vb/action/actions',
  'vb/action/actionUtils',
  'ojs/ojkeyset'
], (
  ActionChain,
  Actions,
  ActionUtils,
  keySet
) => {
  'use strict';

  class onSelectSpecificRowsActionChain extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application } = context;

      // select only specific key rows with keys 1,3
      $page.variables.selectedRows = { "row": new keySet.KeySetImpl([1,3]), "column": new keySet.KeySetImpl() };
    }
  }

  return onSelectSpecificRowsActionChain;
});
