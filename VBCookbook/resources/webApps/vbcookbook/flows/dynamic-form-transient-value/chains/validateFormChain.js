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

  class validateFormChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {string} params.validationGroupId 
     */
    async run(context, { validationGroupId }) {
      const { $flow, $application } = context;

      const validationTracker = document.getElementById(validationGroupId);

      if (validationTracker) {
        if ( validationTracker.valid === 'valid' ) {
          return true;
        }
        else {
          validationTracker.showMessages();
          validationTracker.focusOn(["@firstInvalidShown"]);

          return false;
        }
      }
      else {
        return false;
      }
    }
  }

  return validateFormChain;
});
