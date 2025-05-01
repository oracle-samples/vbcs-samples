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

  class loadEmployeeChain3 extends ActionChain {

    /**
     * Loads Employee record data
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.fetchedFields 
     * @param {string} params.employeeId 
     */
    async run(context, { fetchedFields, employeeId = '101' }) {
      const { $page, $flow, $application, $constants, $variables } = context;

      // Updates form status to Pending.
      $variables.employeeEditFormLoadingStatus3 = 'pending';

      try {
        // Clears Employee data the variable holds
        await Actions.resetVariables(context, {
          variables: [
            '$page.variables.employee3',
            '$page.variables.fetchedEmployee3',
          ],
        }, { id: 'resetEmployeeData' });

        // Tests the REST call can be initiated
        if (fetchedFields && fetchedFields.length && employeeId !== undefined) {
          // Initiates REST call loading Employee data
          const callRestResult = await Actions.callRest(context, {
            endpoint: 'businessObjects/get_Employee',
            responseFields: fetchedFields,
            uriParams: {
              'Employee_Id': employeeId,
            },
          }, { id: 'loadEmployee' });

          if (!callRestResult.ok) {
            // Shows an error message informing about data load failure
            await Actions.fireNotificationEvent(context, {
              summary: 'Could not load data',
              message: `Could not load data: status ${callRestResult.status}`,
            }, { id: 'fireErrorNotification' });

            return;
          }

          // Assigns data loaded by the REST call to the Employee variable
          $variables.fetchedEmployee3 = callRestResult.body;

          $variables.employeeETag3 = callRestResult.headers.get('ETag');

          // Assigns data loaded by the REST call to the Employee editable record variable
          $variables.employee3 = $variables.fetchedEmployee3;
        }
      } finally {
        // Updates form status to Ready.
        $variables.employeeEditFormLoadingStatus3 = 'ready';
      }
    }
  }

  return loadEmployeeChain3;
});
