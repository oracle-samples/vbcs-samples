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

  class handleValidateClickChain extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application } = context;

      function waitTillPending() {
        // make the button action wait till the
        // field validation gets over ie tracker
        // status changes to something other than 'pending'
        return new Promise(function (resolve, reject) {
          let tracker = document.getElementById("tracker");
          let waitForValidation = function () {
            if (tracker.valid === "pending") {
              // simulated field validation at server still going on
              setTimeout(function () {
                return waitForValidation();
              }, 200);
            } else {
              resolve(true);
            }
          };
          waitForValidation();
        });
      }

      await waitTillPending();

      function isFormValid(arg1) {
        let el = document.getElementById("tracker");
        if (el.valid === "valid") {
          return true;
        } else {
          el.showMessages();
          el.focusOn("@firstInvalidShown");
          return false;
        }
      }

      const formValidReturn = await isFormValid();

      if ( formValidReturn )
      {
        await Actions.fireNotificationEvent(context, {
          summary: 'Details entered are valid.',
          message: 'Form is valid',
          displayMode: 'transient',
          type: 'confirmation',
        });
        
      } else {
        await Actions.fireNotificationEvent(context, {
          summary: 'Please fix the errors in the form',
          message: 'Invalid data provided',
          displayMode: 'transient',
        });
      }
    }
  }

  return handleValidateClickChain;
});
