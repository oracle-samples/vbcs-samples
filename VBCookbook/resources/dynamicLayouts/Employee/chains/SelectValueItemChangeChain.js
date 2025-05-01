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

  class SelectValueItemChangeChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.key 
     * @param {any} params.data 
     * @param {any} params.metadata 
     */
    async run(context, { key, data, metadata }) {
      const { $layout, $responsive, $user } = context;

      if ( data !== null )
      {
        $layout.variables.minSalary = data.minSalary;
        $layout.variables.maxSalary = data.maxSalary;
      }
      else
      {
        // set to default
        await Actions.resetVariables(context, {
          variables: [
            '$layout.variables.maxSalary',
            '$layout.variables.minSalary',
          ],
        });
      }
    }
  }

  return SelectValueItemChangeChain;
});
