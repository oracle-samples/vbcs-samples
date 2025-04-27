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

  class loadJobChain extends ActionChain {

    /**
     * Loads Job record data
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.fetchedFields 
     * @param {string} params.jobId 
     */
    async run(context, { fetchedFields, jobId = '1' }) {
      const { $page, $flow, $application, $constants, $variables } = context;

      // Updates form status to Pending.
      $variables.jobEditFormLoadingStatus = 'pending';

      try {
        // Clears Job data the variable holds
        await Actions.resetVariables(context, {
          variables: [
            '$page.variables.job',
            '$page.variables.fetchedJob',
          ],
        }, { id: 'resetJobData' });

        // Tests the REST call can be initiated
        if (fetchedFields && fetchedFields.length && jobId !== undefined) {

          //removing custom field
          const fetchedFieldsTrimmed = fetchedFields.filter(i => !i.name.match("currency"));
          
          // Initiates REST call loading Job data
          const callRestResult = await Actions.callRest(context, {
            endpoint: 'businessObjects/get_Job',
            responseFields: fetchedFieldsTrimmed,
            uriParams: {
              'Job_Id': jobId,
            },
          }, { id: 'loadJob' });

          if (!callRestResult.ok) {
            // Shows an error message informing about data load failure
            await Actions.fireNotificationEvent(context, {
              summary: 'Could not load data',
              message: `Could not load data: status ${callRestResult.status}`,
            }, { id: 'fireErrorNotification' });

            return;
          }

          // Assigns data loaded by the REST call to the Job variable
          $variables.fetchedJob = callRestResult.body;

          $variables.jobETag = callRestResult.headers.get('ETag');

          // Assigns data loaded by the REST call to the Job editable record variable
          $variables.job = $variables.fetchedJob;
          $variables.job.currency = 'usd' ;
        }
      } finally {
        // Updates form status to Ready.
        $variables.jobEditFormLoadingStatus = 'ready';
      }
    }
  }

  return loadJobChain;
});
