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

  class deleteRowButtonActionChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {number} params.rowId 
     */
    async run(context, { rowId }) {
      const { $page, $flow, $application } = context;

      await Actions.fireDataProviderEvent(context, {
        target: $page.variables.contactDetailsADP,
        remove: {
          keys: [ rowId ]
        },
      }, { id: 'fireDataProviderEventContactsDetailsADP' });
    }
  }

  return deleteRowButtonActionChain;
});
