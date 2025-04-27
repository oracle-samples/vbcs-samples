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

  class navigateToEditEmployeeChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {string} params.employeeId 
     */
    async run(context, { employeeId }) {
      const { $page, $flow, $application } = context;

      const toBoTriggersEditEmployee = await Actions.navigateToPage(context, {
        page: 'bo-triggers-edit-employee',
        params: {
          employeeId: employeeId,
        },
      });
    }
  }

  return navigateToEditEmployeeChain;
});
