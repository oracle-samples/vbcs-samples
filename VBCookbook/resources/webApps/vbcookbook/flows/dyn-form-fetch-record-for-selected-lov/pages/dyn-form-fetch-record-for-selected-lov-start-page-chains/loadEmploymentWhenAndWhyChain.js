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

  class loadEmploymentWhenAndWhyChain extends ActionChain {

    /**
     * Loads employmentWhenAndWhy record data
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.fetchedFields 
     * @param {string} params.employmentWhenAndWhyId 
     */
    async run(context, { fetchedFields, employmentWhenAndWhyId = '1' }) {
      const { $page, $flow, $application } = context;

      // Updates form status to Pending.
      $page.variables.employmentWhenAndWhyEditFormLoadingStatus = 'pending';

      try {
        // Clears employmentWhenAndWhy data the variable holds
        await Actions.resetVariables(context, {
          variables: [
            '$page.variables.employmentWhenAndWhy',
            '$page.variables.fetchedEmploymentWhenAndWhy',
          ],
        }, { id: 'resetEmploymentWhenAndWhyData' });

        // Tests the REST call can be initiated
        if (fetchedFields && fetchedFields.length && employmentWhenAndWhyId !== undefined) {
          // Initiates REST call loading employmentWhenAndWhy data
          const callRestResult = await Actions.callRest(context, {
            endpoint: 'employmentWhenAndWhy/doall_performOperationAndValidation_employmentWhenAndWhy'} );

          if (!callRestResult.ok) {
            // Shows an error message informing about data load failure
            await Actions.fireNotificationEvent(context, {
              summary: 'Could not load data',
              message: `Could not load data: status ${callRestResult.status}`,
            }, { id: 'fireErrorNotification' });

            return;
          }

          // Assigns data loaded by the REST call to the employmentWhenAndWhy variable
          $page.variables.fetchedEmploymentWhenAndWhy = callRestResult.body.result;

          $page.variables.employmentWhenAndWhyETag = callRestResult.headers.get('ETag');

          // Assigns data loaded by the REST call to the employmentWhenAndWhy editable record variable
          $page.variables.employmentWhenAndWhy = $page.variables.fetchedEmploymentWhenAndWhy;

          if ($page.variables.fetchedEmploymentWhenAndWhy.PositionId !== null) {

            $page.variables.positionId = $page.variables.fetchedEmploymentWhenAndWhy.PositionId;

            const positionsRecord = await Actions.callRest(context, {
              endpoint: 'positionsLov/get_positionsLov',
              uriParams: {
                'positionsLov_Id': $page.variables.positionId,
              },
            });
            
            $page.variables.employmentWhenAndWhy.positionsLov = positionsRecord.body;
            
          } else {
            $page.variables.positionId = undefined;
          }
        }
      } finally {
        // Updates form status to Ready.
        $page.variables.employmentWhenAndWhyEditFormLoadingStatus = 'ready';
      }
    }
  }

  return loadEmploymentWhenAndWhyChain;
});
