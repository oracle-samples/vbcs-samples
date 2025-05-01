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

  class insertRowButtonActionChain extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application } = context;

      await Actions.fireDataProviderEvent(context, {
        target: $page.variables.contactDetailsADP,
        add: {
          data: [
            {
              id: $page.variables.newRecordID,
            },
          ],
          keys: [
            $page.variables.newRecordID,
          ],
          indexes: [
        0
      ],
        },
      }, { id: 'fireDataProviderEventOnADP' });

      // assignVariablesNewRecordId
      $page.variables.newRecordID = $page.variables.newRecordID-1;
    }
  }

  return insertRowButtonActionChain;
});
