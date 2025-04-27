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
     * @param {any} params.files 
     */
    async run(context, { files }) {
      const { $page, $flow, $application } = context;

      await Actions.resetVariables(context, {
        variables: [
          '$page.variables.current',
        ],
      });

      const readAndProcessResult = await $page.functions.readAndProcess(files);

      if (readAndProcessResult) {
        $page.variables.columns = readAndProcessResult.result.columns;
        $page.variables.uploadDataADP.data = readAndProcessResult.result.tableData;
        $page.variables.current = {
          "hasfileLoaded" : true,
          "name": readAndProcessResult.result.name,
          "size": readAndProcessResult.result.size,
          "type": readAndProcessResult.result.type
        };
      } else {
        await Actions.fireNotificationEvent(context, {
          summary: readAndProcessResult.error.detail,
        });

        await Actions.resetVariables(context, {
        variables: [
          '$page.variables.current',
        ],
      });
      }
    }
  }

  return FilePickerSelectChain;
});
