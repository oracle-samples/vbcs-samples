/**
 * Copyright (c)2023 Oracle and/or its affiliates.
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
     */
    async run(context) {
      const { $fragment, $application } = context;

      const fireEventClickedResult = await Actions.fireEvent(context, {
        event: 'clicked',
        payload: {
          value: $fragment.variables.adp.data.length > 0 ? $fragment.variables.adp.data[0][$fragment.variables.queryProperty] : '?',
        },
      });
    }
  }

  return HyperlinkClickChain;
});
