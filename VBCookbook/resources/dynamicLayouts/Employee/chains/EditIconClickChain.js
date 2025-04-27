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

  class EditIconClickChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {string} params.action 
     * @param {any} params.rowId 
     */
    async run(context, { action = 'open', rowId }) {
      const { $layout, $responsive, $user, $constants, $variables } = context;

      await Actions.fireEvent(context, {
        event: 'customAction',
        payload: {
          action: action,
          rowKey: rowId,
        },
      });
    }
  }

  return EditIconClickChain;
});
