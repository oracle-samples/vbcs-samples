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

  class SelectSingleValueChangeChain extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application } = context;

      if ($page.variables.selectedLocale && 
          $page.variables.selectedLocale !== window.localStorage.getItem(
          "vbcs.languageSwitcherApplication.locale")) {
        window.localStorage.setItem(
          "vbcs.languageSwitcherApplication.locale",
          $page.variables.selectedLocale
        );
        window.location.reload();
      }
    }
  }

  return SelectSingleValueChangeChain;
});
