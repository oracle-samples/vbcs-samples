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

  class performSwipeOperationChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {string} params.employeeId 
     * @param {string} params.navigationItem 
     */
    async run(context, { employeeId, navigationItem }) {
      const { $page, $flow, $application } = context;

      switch (navigationItem) {
        case 'rightedit':
          const toSwipeToEditEditpage = await Actions.navigateToPage(context, {
            page: 'swipe-to-edit-editpage',
            params: {
              'employee_ID': employeeId,
            },
          });
        default:
          break;
      }
    }
  }

  return performSwipeOperationChain;
});
