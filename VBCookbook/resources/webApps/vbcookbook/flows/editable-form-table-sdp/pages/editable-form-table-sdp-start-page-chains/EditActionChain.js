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

  class EditActionChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.current 
     * @param {number} params.index 
     * @param {any} params.key 
     */
    async run(context, { current, index, key }) {
      const { $page, $flow, $application, $chain } = context;

      $page.variables.editRow = { rowKey:key };
    }
  }

  return EditActionChain;
});
