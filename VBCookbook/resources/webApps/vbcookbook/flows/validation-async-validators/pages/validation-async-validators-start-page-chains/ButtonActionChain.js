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

  class ButtonActionChain extends ActionChain {

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

      function validateGroup(arg1) {
        let tracker = document.getElementById("tracker");
        if (tracker.valid === "valid") {
        } else if (tracker.valid.startsWith("invalid")) {
          if (tracker.valid === "invalidHidden") {
            tracker.showMessages();
          }
          tracker.focusOn("@firstInvalidShown");
        }
        return tracker.valid;
      }

      const validateGroupFlag = await validateGroup();

      if (validateGroupFlag === 'valid') {
        await Actions.fireNotificationEvent(context, {
          summary: 'Data Is Valid',
          message: 'Everything is valid. Form has been submitted.',
          displayMode: 'transient',
          type: 'confirmation',
        });
      }
    }
  }

  return ButtonActionChain;
});
