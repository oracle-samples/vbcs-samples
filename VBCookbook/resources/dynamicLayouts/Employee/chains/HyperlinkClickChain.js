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

  class HyperlinkClickChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.empId 
     */
    async run(context, { empId }) {
      const { $layout, $responsive, $user } = context;

      await Actions.fireEvent(context, {
        event: 'empDetail',
        payload: {
          empId: empId,
        },
      });
    }
  }

  return HyperlinkClickChain;
});
