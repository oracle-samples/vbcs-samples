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

  class populateCountries extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $flow, $application, $constants, $variables } = context;

      if ($flow.variables.countryADPInitialized === false) {
        const response = await Actions.callRest(context, {
          endpoint: 'businessObjects/getall_Country',
          uriParams: {
            limit: 500,
          },
          requestTransformOptions: {
            sort: [
              {
                attribute: 'countryName'
              }
            ]
          }
        });

        if (response.ok) {
          $variables.countryADPInitialized = true;
          $variables.countryADP.data = response.body.items;
        } else {
          await Actions.fireNotificationEvent(context, {
            summary: response.message.summary,
          });
        }
      }
    }
  }

  return populateCountries;
});
