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

  class OpenCategory extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {string} params.category 
     */
    async run(context, { category }) {
      const { $page, $flow, $application, $constants, $variables } = context;

      $variables.filter = category;
      $variables.fullText = "";
    }
  }

  return OpenCategory;
});
