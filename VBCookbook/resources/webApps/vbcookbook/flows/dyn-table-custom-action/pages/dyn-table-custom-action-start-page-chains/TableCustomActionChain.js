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

  class TableCustomActionChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {string} params.action 
     * @param {any} params.rowKey 
     */
    async run(context, { action, rowKey }) {
      const { $page, $flow, $application, $constants, $variables } = context;

       if (action === 'edit') {
        const toDynTableCustomActionEdit = await Actions.navigateToPage(context, {
          page: 'dyn-table-custom-action-edit',
          params: {
            empId: rowKey,
          },
        });

      } else {
         const response2 = await Actions.callRest(context, {
           endpoint: 'businessObjects/delete_Employee',
           uriParams: {
             'Employee_Id': rowKey,
           },
         });

        await Actions.fireDataProviderEvent(context, {
          target: $variables.employeeListSDP,
          refresh: null,
        });
      }

    }
  }

return TableCustomActionChain;
});
