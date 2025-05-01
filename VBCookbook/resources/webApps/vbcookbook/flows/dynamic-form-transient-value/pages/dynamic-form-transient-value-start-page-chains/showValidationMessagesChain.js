/**
 * Copyright (c)2020, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([
  'vb/action/actionChain',
  'vb/action/actions',
], (
  ActionChain,
  Actions
) => {
  'use strict';

  class showValidationMessagesChain extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page } = context;

      await Promise.all([
        async() => {

          if ($page.variables.formState1  !== 'valid') {
            await Actions.callComponentMethod(context, {
              selector: '#section1DynForm',
              method: 'showMessages',
            });
          }
        },
        async() => {

          if ($page.variables.formState2  !== 'valid') {
            await Actions.callComponentMethod(context, {
              selector: '#section2DynForm',
              method: 'showMessages',
            });
          }
        },
      ].map(sequence => sequence()));
    }
  }

  return showValidationMessagesChain;
});
