/**
 * Copyright (c)2020, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([
  'vb/action/actionChain'
],  ActionChain  => {
  'use strict';

  class dialogResponseChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.detail 
     * @param {string} params.response 
     */
    async run(context, { response }) {
      const { $page } = context;

      // Close dialog
      $page.variables.dirtyDialogOpen = false;

      await $page.functions.userResponse(response);
    }
  }

  return dialogResponseChain;
});
