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

  class UploadFile extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application } = context;

      if ($page.variables.fileUpload.File) {
        await Actions.callComponentMethod(context, {
          selector: '#modalDialog1',
          method: 'close',
        });

        $page.variables.faServerBusy = true;

        const base64StringFromFile = await new Promise((resolve, reject) => {
          let reader = new FileReader();
          reader.readAsDataURL($page.variables.fileUpload.File);
          reader.onload = function () {
            // reader.result will be "data:image/png;base64,iVBORw0KGgoAAAANSU......"
            let index = reader.result.indexOf(";base64,");
            let result = {
              base64: reader.result.slice(index + 8),
              contentType: reader.result.slice(5, index),
            };
            resolve(result);
          };
          reader.onerror = function (error) {
            reject(error);
          };
        });

        $page.variables.fileUpload.FileContents = base64StringFromFile.base64;
        $page.variables.fileUpload.File = undefined;
        $page.variables.fileUpload.Size = undefined;
        $page.variables.fileUpload.UploadedFileContentType = base64StringFromFile.contentType;

        const response = await Actions.callRest(context, {
          endpoint: 'activities_vb/create_activities-Attachments',
          uriParams: {
            'activities_Id': $page.variables.testingActivityId,
          },
          body: $page.variables.fileUpload,
        });

        if (response.ok) {
          await Actions.fireNotificationEvent(context, {
            summary: 'File ' + $page.variables.fileUpload.FileName + ' was successfully uploaded.',
            displayMode: 'transient',
            type: 'info',
          });

          await Actions.fireDataProviderEvent(context, {
            refresh: null,
            target: $page.variables.attachmentsSDP,
          });

          $page.variables.faServerBusy = false;
        } else {
          await Actions.fireNotificationEvent(context, {
            summary: 'Upload failed.',
          });

          $page.variables.faServerBusy = false;
        }
      } else {
        await Actions.fireNotificationEvent(context, {
          displayMode: 'transient',
          type: 'error',
          message: 'Please Select A file To Upload',
          summary: 'Nothing Selected.',
        });
      }
    }
  }

  return UploadFile;
});
