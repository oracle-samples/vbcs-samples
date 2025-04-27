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

  class beforeTabChange extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.detail 
     */
    async run(context, { detail }) {
      const { $page, $flow, $application } = context;

      if ($page.variables.dirtyForm) {
        $page.variables.tabToSwitch = detail.key;

        const unsavedDataDialogOpen = await Actions.callComponentMethod(context, {
          selector: '#unsaved-data-dialog',
          method: 'open',
        });
      }
    }
  }

  return beforeTabChange;
});
