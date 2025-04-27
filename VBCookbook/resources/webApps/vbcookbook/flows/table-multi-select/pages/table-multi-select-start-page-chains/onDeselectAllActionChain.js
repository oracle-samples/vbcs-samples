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

  class onDeselectAllActionChain extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application } = context;

      // reset the current selection to none
      $page.variables.selectedRows = { "row": new keySet.KeySetImpl(), "column": new keySet.KeySetImpl() };
    }
  }

  return onDeselectAllActionChain;
});
