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

  class saveEmployeeChain extends ActionChain {
    
    async run(context, { employeeId = '100' }) {
      const { $page, $flow, $application } = context;

      await Actions.fireNotificationEvent(context, {
        summary: 'Saving employment status as: ' + $page.variables.employee.employmentStatus,
        type: 'confirmation',
      });
    }

  }

  return saveEmployeeChain;
});
