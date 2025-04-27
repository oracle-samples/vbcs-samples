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

  class InputSearchValueActionChain extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application, $constants, $variables } = context;

      const matchedRecipes = await $application.functions.getMatchedRecipes($variables.filter, $variables.fullText);

      if ( matchedRecipes.data.length === 1 && $page.variables.fullText === matchedRecipes.data[0].label ) {
        await Actions.callChain(context, {
          chain: 'CardActionChain',
          params: {
            recipe: matchedRecipes.data[0].id,
          },
        });
      }
    }
  }

  return InputSearchValueActionChain;
});
