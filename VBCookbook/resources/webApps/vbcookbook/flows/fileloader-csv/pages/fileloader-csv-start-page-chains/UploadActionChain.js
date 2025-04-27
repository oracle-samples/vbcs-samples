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

  class UploadActionChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {object} params.payload 
     */
    async run(context, { payload }) {
      const { $page, $flow, $application } = context;

      const response = await Actions.callRest(context, {
        endpoint: 'businessObjects/batch',
        body: payload,
      });

      if ( response.ok ) {
        await Actions.fireNotificationEvent(context, {
          displayMode: 'transient',
          type: 'confirmation',
          summary: 'Upload success.',
        });
      } else {
        await Actions.fireNotificationEvent(context, {
          summary: response.message.summary,
        });
      }
    }
  }

  return UploadActionChain;
});
