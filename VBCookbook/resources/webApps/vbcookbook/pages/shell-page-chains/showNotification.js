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

  class showNotification extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {messageType} params.eventPayload 
     */
    async run(context, { eventPayload }) {
      const { $page, $flow, $application, $constants, $variables } = context;

      await Actions.fireDataProviderEvent(context, {
        target: $variables.messagesADP,
        add: {
          data: [ eventPayload ],
        },
      });
    }
  }

  return showNotification;
});
