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

  class OpenDialogChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.current 
     */
    async run(context, { current }) {
      const { $page, $flow, $application } = context;

      $page.variables.currentEmployee = current;

      const ojDialog11556371901Open = await Actions.callComponentMethod(context, {
        selector: '#oj-dialog--1155637190-1',
        method: 'open',
      });
    }
  }

  return OpenDialogChain;
});
