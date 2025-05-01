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

  class ValidateAndUploadActionChain extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application } = context;

      if ($page.variables.boFormValid === 'valid') {
        document.getElementById('oj-dialog--1728153767-1').close();

        $page.variables.isUploadingToBo = true;

        let data = $page.variables.uploadDataADP.data;
        let boPath = $page.variables.boPath;
        let boOp = $page.variables.boOp;
        
        let preparePayload = {
          parts: data.map((r, idx) => ({
            id: `part-${idx}`,
            operation: boOp,
            path: boPath,
            payload: r,
          })),
        };

        await Actions.callChain(context, {
          chain: 'UploadActionChain',
          params: {
            payload: preparePayload,
          },
        });

        $page.variables.isUploadingToBo = false;
      } else {
        document.getElementById('bo-config-tacker').showMessages();
        document.getElementById('bo-config-tacker').focusOn(["@firstInvalidShown"]);
      }
    }
  }

  return ValidateAndUploadActionChain;
});
