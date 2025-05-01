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

  class openRecipe extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {{recipeName:string}} params.event
     */
    async run(context, { event }) {
      const { $application } = context;

      const toShell = await Actions.navigateToPage(context, {
        page: `/shell/${event.recipeName}/${event.recipeName}-start/recipe/recipe-start`,
      });

    }
  }

  return openRecipe;
});
