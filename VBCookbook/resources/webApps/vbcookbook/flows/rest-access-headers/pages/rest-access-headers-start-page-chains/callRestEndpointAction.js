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

  class callRestEndpointAction extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application, $chain } = context;

      const response = await Actions.callRest(context, {
        endpoint: 'ords/getEmployees',
      });

      if (!response.ok) {
        await Actions.fireNotificationEvent(context, {
          summary: response.message.summary,
        });
      } else {
        let allHeaders = [];
        let entries = response.headers.entries();

        for (const element of entries) {
          let item = {};
          item.key = element[0]; // header name
          item.value = element[1]; // header value
          allHeaders.push(item);
        }

        $page.variables.responseHeaders.data = allHeaders;
      }
    }
  }

  return callRestEndpointAction;
});
