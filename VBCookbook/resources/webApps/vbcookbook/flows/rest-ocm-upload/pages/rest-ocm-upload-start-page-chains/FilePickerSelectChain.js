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

  class FilePickerSelectChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {object[]} params.files 
     */
    async run(context, { files }) {
      const { $page, $flow, $application, $current } = context;

      $page.variables.ocmServerBusy = true;

      const results = await ActionUtils.forEach(files, async (item, index) => {

        if (item.name !== undefined) {
          if (item.size < 1100000) {
            const response = await Actions.callRest(context, {
              endpoint: 'ocm/uploadFile',
              uriParams: {
                filename: item.name,
              },
              body: {
                jsonInputParameters: {
                  parentID: 'self',
                },
                primaryFile: item
              },
              contentType: 'multipart/form-data',
            });

            if (!response.ok) {
              await Actions.fireNotificationEvent(context, {
                summary: 'Upload failed',
              });
            } else {
              await Actions.fireNotificationEvent(context, {
                summary: 'File ' + item.name + ' was successfully uploaded',
                displayMode: 'transient',
                type: 'info',
              });
            }
          } else {
            await Actions.fireNotificationEvent(context, {
              summary: 'File ' + item.name + ' is too big (1MB is the limit).'
            });
          }
        } else {
          await Actions.fireNotificationEvent(context, {
            summary: 'Only jpeg, gif and png formats are supported.',
          });
        }
      }, { mode: 'serial' });

      $page.variables.ocmServerBusy = false;

      await Actions.fireDataProviderEvent(context, {
        refresh: null,
        target: $page.variables.ocmFilesSDP,
      });
      
    }
  }

  return FilePickerSelectChain;
});
