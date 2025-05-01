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

  class DeleteFile extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.current 
     * @param {any} params.detail 
     * @param {any} params.key 
     */
    async run(context, { current, detail, key }) {
      const { $page, $flow, $application, $chain } = context;

      const realAttachedDocumentId = await $page.functions.getRealAttachedDocumentId(current.row);

      const response = await Actions.callRest(context, {
        endpoint: 'activities_vb/delete_activities-Attachments',
        uriParams: {
          'activities_Id': $page.variables.testingActivityId,
          'activities_Attachments_Id': realAttachedDocumentId,
        },
      });

      if (response.ok) {
          await Actions.fireNotificationEvent(context, {
            displayMode: 'transient',
            type: 'confirmation',
            summary: 'File ' + current.row.FileName + ' was deleted',
          });

        await Actions.fireDataProviderEvent(context, {
          refresh: null,
          target: $page.variables.attachmentsSDP,
        });
      } else {
        await Actions.fireNotificationEvent(context, {
          summary: 'Delete operation failed.',
        });
      }
    }
  }

  return DeleteFile;
});
