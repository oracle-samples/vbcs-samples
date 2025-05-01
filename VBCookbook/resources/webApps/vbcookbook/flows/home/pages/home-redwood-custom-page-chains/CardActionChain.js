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

  class CardActionChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.recipe 
     */
    async run(context, { recipe }) {
      const { $page, $flow, $application, $constants, $variables } = context;

      if ( $application.functions.isRecipe(recipe )) {
        $application.variables.canNavigateBack = true;

        await Actions.navigateToFlow(context, {
          target: 'parent',
          flow: recipe,
          page : recipe + '-start/recipe/recipe-start'
        }, { id: 'navigateToRecipe' });
      }
    }
  }

  return CardActionChain;
});
