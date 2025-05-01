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

      $page.variables.faServerBusy = true;

      const realAttachedDocumentId = await $page.functions.getRealAttachedDocumentId(current.row);

      const response2 = await Actions.callRest(context, {
        endpoint: 'activities_vb/get_activities-Attachments-FileContents',
        uriParams: {
          'activities_Id': $page.variables.testingActivityId,
          'activities_Attachments_Id': realAttachedDocumentId,
        },
      });

      if (response2.ok) {
          await $page.functions.download(response2.body, current.row.UploadedFileContentType, current.row.FileName);

        $page.variables.faServerBusy = false;
      } else {
        await Actions.fireNotificationEvent(context, {
          summary: 'Download failed.',
        });
      }
    }
  }

  return DownloadAttachment;
});
