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

  class TableBeforeRowEditEndChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.cancelEdit 
     * @param {any} params.detail 
     * @param {get_Employee} params.originalRowData 
     * @param {get_Employee} params.rowData 
     */
    async run(context, { cancelEdit, detail, originalRowData, rowData }) {
      const { $page, $flow, $application, $chain } = context;

      if ($page.variables.cancelEditVar === true) {
        await Actions.resetVariables(context, {
          variables: [
            '$page.variables.cancelEditVar',
          ],
        });
      } else {
        if ($page.functions.areDifferent(rowData, originalRowData)) {
          await Actions.fireDataProviderEvent(context, {
            target: $page.variables.employeeListSDP,
            update: {
              data: {
                "items": [
                  {
                    "id": rowData.id,
                    "firstName": rowData.firstName,
                    "lastName": rowData.lastName,
                    "email": rowData.email,
                    "phoneNumber": rowData.phoneNumber
                  }
                ]
              },
              keys: [rowData.id]
            },
          });

          const response = await Actions.callRest(context, {
            endpoint: 'businessObjects/update_Employee',
            uriParams: {
              'Employee_Id': rowData.id,
            },
            body: {
              "firstName": rowData.firstName,
              "lastName": rowData.lastName,
              "email": rowData.email,
              "phoneNumber": rowData.phoneNumber
            },
          });

          if (!response.ok) {
            await Actions.fireNotificationEvent(context, {
              summary: response.message.summary
            });
          }
        }
      }
    }
  }

  return TableBeforeRowEditEndChain;
});
