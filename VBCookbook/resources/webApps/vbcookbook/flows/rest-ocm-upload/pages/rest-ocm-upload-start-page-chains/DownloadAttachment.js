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

  class DownloadAttachment extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.current 
     * @param {any} params.detail 
     * @param {any} params.key 
     */
    async run(context, { current, detail, key }) {
      const { $page, $flow, $application } = context;

      /**
       * Download content of blobData as a file. Downloaded filename can be specified
       * using fileName param.
       */
      function download(blobData, contentType, fileName) {
        let element = document.createElement("a");
        element.setAttribute("href", $page.functions.preview(blobData, contentType));
        element.setAttribute("download", fileName);
        element.style.display = "none";
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
      }

      $page.variables.ocmServerBusy = true;

      const response = await Actions.callRest(context, {
        endpoint: 'ocm/downloadFile',
        uriParams: {
          'fileID': key
        },
        responseBodyFormat: "blob"
      });

      if (response.ok) {
        await download(response.body, current.row.mimeType, current.row.name);
      } else {
        await Actions.fireNotificationEvent(context, {
          summary: 'Download failed.',
        });
      }

      $page.variables.ocmServerBusy = false;
    }
  }

  return DownloadAttachment;
});
