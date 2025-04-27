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

  class GetLocationActionChain extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application, $chain } = context;

      try {
        const location = await Actions.geolocation(context, {
          timeout: 10000,
        });

        $page.variables.latitude = location.coords.latitude;
        $page.variables.longitude = location.coords.longitude;

      } catch (error) {
        await Actions.fireNotificationEvent(context, {
          summary: error.message,
        });
      }
    }
  }

  return GetLocationActionChain;
});
