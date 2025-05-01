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

  class TableScrollPositionChangeChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.scrollPosition 
     */
    async run(context, { scrollPosition }) {
      const { $page, $flow, $application, $constants } = context;

      $flow.variables.scrollPosition.rowIndex = scrollPosition.rowIndex;
      $flow.variables.scrollPosition.offsetY = scrollPosition.offsetY;
    }
  }

  return TableScrollPositionChangeChain;
});
