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

  class loadDepartmentChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {string} params.departmentId 
     * @param {any[]} params.fetchedFields 
     */
    async run(context, { departmentId = '6', fetchedFields }) {
      const { $page, $flow, $application, $variables, $response } = context;

      $page.variables.departmentDetailFormLoadingStatus = 'pending';

      await Actions.resetVariables(context, {
        variables: [
          '$page.variables.department',
        ],
      });

      if ( fetchedFields && fetchedFields.length && departmentId !== undefined ) {
        const response = await Actions.callRest(context, {
          endpoint: 'businessObjects/get_Department',
          uriParams: {
            'Department_Id': departmentId,
          },
        }, { id: 'loadDepartmentRecord' });

        if (!response.ok) {
          await Actions.fireNotificationEvent(context, {
            summary: 'Could not load data',
            message: 'Could not load data: status ' + response.statusText + '(' + response.status + ')',
          });
        
          return;
        } else {
          $page.variables.department = response.body;
          $page.variables.departmentDetailFormLoadingStatus = 'ready';
        }
      }
    }
  }

  return loadDepartmentChain;
});
