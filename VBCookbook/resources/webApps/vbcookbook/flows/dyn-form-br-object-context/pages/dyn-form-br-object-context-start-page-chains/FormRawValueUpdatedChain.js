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

  class FormRawValueUpdatedChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.event 
     */
    async run(context, { event }) {
      const { $page, $flow, $application, $constants, $variables, $event } = context;

      if (event.previousValue.currency !== event.value.currency) {

        $variables.expenseObjectContext.exchangeRate = undefined;
        //using setTimeout to similate that retrieval of exchange rate can be asynchronous and take its time
        //in real applicaiton a REST call would be called here
        setTimeout(() => {
          if (event.value.currency === 'INR') {
            $variables.expenseObjectContext.exchangeRate = 84.4;
          } else if (event.value.currency === 'EUR') {
            $variables.expenseObjectContext.exchangeRate = 0.95;
          } else {
            $variables.expenseObjectContext.exchangeRate = 1;
          }
        }, 2000);
      }
    }
  }

  return FormRawValueUpdatedChain;
});
