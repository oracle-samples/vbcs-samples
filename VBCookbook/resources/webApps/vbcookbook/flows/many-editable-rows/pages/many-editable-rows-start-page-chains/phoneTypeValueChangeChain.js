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

  class phoneTypeValueChangeChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {string} params.newValue 
     * @param {object} params.row 
     */
    async run(context, { newValue, row }) {
      const { $page, $flow, $application } = context;

      let updatedRow = {"id" : row.id,"phoneNumber": row.phoneNumber, "phoneType" : newValue  };

      await Actions.fireDataProviderEvent(context, {
        target: $page.variables.contactDetailsADP,
        update: {
          data: [ updatedRow ]
        }
      }, { id: 'fireDataProviderEventContactDetailsADP' });
    }
  }

  return phoneTypeValueChangeChain;
});
