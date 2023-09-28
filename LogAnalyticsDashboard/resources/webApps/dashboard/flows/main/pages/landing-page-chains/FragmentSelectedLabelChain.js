/**
 * Copyright (c)2023 Oracle and/or its affiliates.
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

  class FragmentSelectedLabelChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {string} params.label 
     */
    async run(context, { label }) {
      const { $page, $flow, $application } = context;

      await Actions.assignVariable(context, {
        variable: '$page.variables.labelFilter',
        value: label,
      });

      await Actions.assignVariable(context, {
        variable: '$page.variables.showMoreFilters',
        value: true,
      });
    }
  }

  return FragmentSelectedLabelChain;
});
