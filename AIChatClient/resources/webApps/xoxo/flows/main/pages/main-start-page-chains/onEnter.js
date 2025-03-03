/**
 * Copyright (c)2025, Oracle and/or its affiliates.
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

  class onEnter extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {string} params.key 
     */
    async run(context, { key }) {
      const { $page, $flow, $application, $constants, $variables } = context;

      if (key === "Enter") {
        // when enter is pressed submit the question
        await Actions.callChain(context, {
          chain: 'AskQuestion',
        });
        
      }
    }
  }

  return onEnter;
});
