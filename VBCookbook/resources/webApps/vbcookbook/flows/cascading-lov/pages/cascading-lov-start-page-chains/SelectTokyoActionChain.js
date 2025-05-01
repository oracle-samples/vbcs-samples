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

  class SelectTokyoActionChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.detail 
     */
    async run(context, { detail }) {
      const { $page, $flow, $application } = context;

      $page.variables.selectedRegion = {
        "data": {
          "id": 3,
          "regionName": "Asia"
        },
        "metadata": {
          "key": 3
        },
        "key": 3
      };

      $page.variables.selectedCountry = {
        "data": {
          "countryName": "Japan",
          "id": 4
        },
        "metadata": {
          "key": 4
        },
        "key": 4
      };

      $page.variables.selectedLocation = {
        "data": {
          "city": "Tokyo",
          "country": 4,
          "id": 3,
          "postalCode": "1689",
          "stateProvince": "Tokyo Prefecture",
          "streetAddress": "2017 Shinjuku-ku"
        },
        "metadata": {
          "key": 3
        },
        "key": 3
      };

      $page.variables.isTokyoSelected = true;
    }
  }

  return SelectTokyoActionChain;
});
