/**
 * Copyright (c)2020, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([
  'vb/action/actionChain',
  'vb/action/actions',
], (
  ActionChain,
  Actions
) => {
  'use strict';

  class spSubmitChain extends ActionChain {

    /**
     * Submit form data
     * @param {Object} context
     * @param {Object} params
     * @param {string} params.type 
     */
    async run(context, { type }) {
      const { $page } = context;

      if ($page.variables.formState1 === 'valid' && $page.variables.formState2 === 'valid') {
        await Actions.callChain(context, {
          chain: 'saveDataChain',
        });

        await Actions.resetVariables(context, {
          variables: [
            '$page.variables.dirtyDataFlag',
          ],
        });

        if (type === 'spPrimaryAction') {
          await Actions.navigateBack(context, {
          });
        } else {
          $page.variables.isSaved = true;
        }
      } else {
        await Actions.callChain(context, {
          chain: 'showValidationMessagesChain',
        });
      }
    }
  }

  return spSubmitChain;
});
