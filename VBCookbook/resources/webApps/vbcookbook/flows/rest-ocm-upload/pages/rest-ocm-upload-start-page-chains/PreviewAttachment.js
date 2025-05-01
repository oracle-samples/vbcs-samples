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

  class PreviewAttachment extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.current 
     * @param {any} params.detail 
     * @param {any} params.key 
     */
    async run(context, { current, detail, key }) {
      const { $page, $flow, $application } = context;

      $page.variables.filePreview = false;
      $page.variables.ocmServerBusy = true;

      const response = await Actions.callRest(context, {
        endpoint: 'ocm/downloadFile',
        uriParams: {
          'fileID': key
        },
        responseBodyFormat: "blob"
      });

      if (response.ok) {
        // generatePreview
        const preview = await $page.functions.preview(response.body, current.row.mimeType);

        $page.variables.filePreview = true;
        $page.variables.fileBodyForPreview = preview;
      } else {
        await Actions.fireNotificationEvent(context, {
          summary: 'Download failed.',
        });
      }

      $page.variables.ocmServerBusy = false;
    }
  }

  return PreviewAttachment;
});
