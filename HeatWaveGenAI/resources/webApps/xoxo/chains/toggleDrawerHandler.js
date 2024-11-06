/**
 * Copyright (c)2024, Oracle and/or its affiliates.
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

  class toggleDrawerHandler extends ActionChain {

    /**
     * Toggles the navigation drawer for the page
     * @param {Object} context
     */
    async run(context) {
      const { $application } = context;

      const fireEventToggleDrawerResult = await Actions.fireEvent(context, {
        event: 'application:toggleDrawer',
      });
    }
  }

  return toggleDrawerHandler;
});
