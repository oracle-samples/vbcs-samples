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

  class FormTransientValueChangeChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.transientValue 
     */
    async run(context, { transientValue }) {
      const { $page, $flow, $application } = context;
      if ($page.variables.positionId !== undefined && transientValue.PositionId !== undefined && 
          transientValue.PositionId !== $page.variables.positionId) {
        console.log(" >>>>>>>> fetch LOV record for "+JSON.stringify(transientValue));
        const positionsRecord = await Actions.callRest(context, {
          endpoint: 'positionsLov/get_positionsLov',
          uriParams: {
            'positionsLov_Id': transientValue.PositionId,
          },
        });
        
        $page.variables.positionId = transientValue.PositionId;

        // clone response object:
        const res = JSON.parse(JSON.stringify(transientValue));
        
        res.positionsLov = positionsRecord.body;
        $page.variables.employmentWhenAndWhy = res;

      }
    }
  }

  return FormTransientValueChangeChain;
});
