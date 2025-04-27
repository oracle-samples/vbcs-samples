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

  class closeNotificationHandler extends ActionChain {

    /**
     * Removes the notification message when its dismiss gesture has been invoked.
     * @param {Object} context
     * @param {Object} params
     * @param {messageType} params.eventMessage 
     */
    async run(context, { eventMessage }) {
      const { $page, $flow, $application, $constants, $variables } = context;

      await Actions.fireDataProviderEvent(context, {
        target: $variables.messagesADP,
        remove: {
          keys: [ eventMessage.id ],
        },
      });
    }
  }

  return closeNotificationHandler;
});
