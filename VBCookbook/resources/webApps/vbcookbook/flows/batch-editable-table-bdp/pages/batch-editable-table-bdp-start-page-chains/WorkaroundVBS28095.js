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

  class WorkaroundVBS28095 extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {{record:object}} params.event
     */
    async run(context, { event }) {
      const { $page, $flow, $application } = context;

      // wait a short time before fixing the problem (to give
      // the problem a chance to conclude)
      await new Promise((resolve) => {
        setTimeout(() => resolve(), 567);
      });

      // workaround for BPD bug which updates current row data but removes referenced jobObject. 
      // this step re-updates the row with correct values (including jobObject reference)
      Actions.fireDataProviderEvent(context, {
        target: $page.variables.employeesBDP.instance,
        update: {
          data: [event.record],
          keys: [event.record.id]
        },
      });
    }
  }

  return WorkaroundVBS28095;
});
