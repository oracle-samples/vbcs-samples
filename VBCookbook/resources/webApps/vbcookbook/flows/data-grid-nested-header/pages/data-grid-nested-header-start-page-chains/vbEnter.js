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

  class vbEnter extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application, $chain } = context;

      const response = await Actions.callRest(context, {
        endpoint: 'businessObjects/getall_Employee',
        responseType: 'getall_Employee',
        uriParams: {
          limit: 999,
          orderBy: 'department',
        },
      });

      if (!response.ok) {
          await Actions.fireNotificationEvent(context, {
            summary: response.message.summary,
          });
      } else {
        const datagridData = await $page.functions.getDatagridData(response.body.items);

        $page.variables.data = datagridData;
      }
    }
  }

  return vbEnter;
});
