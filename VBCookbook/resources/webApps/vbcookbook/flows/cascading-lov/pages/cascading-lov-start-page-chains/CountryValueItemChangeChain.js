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

  class CountryValueItemChangeChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.key 
     * @param {any} params.previousKey 
     */
    async run(context, { key, previousKey }) {
      const { $page, $flow, $application } = context;

      if ($page.variables.isTokyoSelected === false) {
        if (key !== previousKey) {
          await Actions.resetVariables(context, {
            variables: [
              '$page.variables.selectedLocation',
            ],
          });
        }
      }

      await Actions.resetVariables(context, {
        variables: [
          '$page.variables.isTokyoSelected',
        ],
      });
    }
  }

  return CountryValueItemChangeChain;
});
