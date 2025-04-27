/**
 * Copyright (c)2020, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([
  'vb/action/actionChain',
  'vb/action/actions',
  'vb/action/actionUtils',
  'ojs/ojoffcanvas'
], (
  ActionChain,
  Actions,
  ActionUtils,
  OffcanvasUtils
) => {
  'use strict';

  class toggleFilterPane extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application } = context;

      function toggle() {
        const options = {
          selector: "#filterDrawer",
          content: "#mainContent",
          modality: "modeless",
          displayMode: "push",
          autoDismiss: "none",
        };
        return OffcanvasUtils.toggle(options);
      }

      await toggle();

      $page.variables.drawerOpen = !$page.variables.drawerOpen;
    }
  }

  return toggleFilterPane;
});
