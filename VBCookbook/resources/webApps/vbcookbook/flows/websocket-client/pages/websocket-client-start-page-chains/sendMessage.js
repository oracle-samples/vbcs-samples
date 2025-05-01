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

  class sendMessage extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application, $constants, $variables } = context;

      await Actions.fireDataProviderEvent(context, {
        target: $variables.logADP,
        add: {
          data: [{id: $variables.lastId, text: "[send] "+$variables.msg}],
          keys: [$variables.lastId],
        },
      });

      $variables.lastId = $variables.lastId +1;
      
      $variables.wsActions.sendMessage($variables.msg);
    }
  }

  return sendMessage;
});
