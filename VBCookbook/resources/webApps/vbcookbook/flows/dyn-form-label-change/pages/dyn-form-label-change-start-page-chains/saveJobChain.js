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

  class saveJobChain extends ActionChain {

    /**
     * Saves Job record data
     * @param {Object} context
     * @param {Object} params
     * @param {string} params.jobId 
     */
    async run(context, { jobId = '1' }) {
      const { $page, $flow, $application, $constants, $variables } = context;

      // Updates form status to Pending.
      $variables.jobEditFormLoadingStatus = 'pending';

      try {
        // Validates Job form
        const validateFormResult = await Actions.callChain(context, {
          chain: 'flow:validateFormChain',
          params: {
            validationGroupId: 'job-validation-group--665055711-1',
          },
        }, { id: 'validateJob' });

        if (!validateFormResult) {
          return;
        }

        const payload = await this.preparePatchPayload(context, {
          updatedRecord: $variables.job,
          fetchedRecord: $variables.fetchedJob,
        });

        if (payload === undefined) {
          // Return from the action chain when there are no changes to save
          return;
        }

        // Initiates REST call saving Job data
        const callRestResult = await Actions.callRest(context, {
          body: payload,
          endpoint: 'businessObjects/update_Job',
          headers: $variables.jobETag ? { 'If-Match': $variables.jobETag } : null,
          requestType: 'json',
          uriParams: {
            'Job_Id': jobId,
          },
        }, { id: 'saveJob' });

        if (!callRestResult.ok) {
          // Create error message
          const errorMessage = callRestResult.body?.detail || callRestResult.body?.['o:errorDetails']?.[0]?.detail || `Could not edit Job: status ${callRestResult.status}`;
          // Fires a notification event about failed save
          await Actions.fireNotificationEvent(context, {
            summary: 'Save failed',
            message: errorMessage,
          }, { id: 'fireErrorNotification' });

          return;
        }

        // Fires a notification event about successful save
        await Actions.fireNotificationEvent(context, {
          summary: 'Job saved',
          message: 'Job record successfully updated',
          displayMode: 'transient',
          type: 'confirmation',
        }, { id: 'fireSuccessNotification' });

        // Calls action chain re-loading Job data
        await Actions.callChain(context, {
          chain: 'loadJobChain',
          params: {
            fetchedFields: $variables.jobEditFormRenderedFields,
          },
        }, { id: 'callLoadJobChain' });
      } finally {
        // Updates form status to Ready.
        $variables.jobEditFormLoadingStatus = 'ready';
      }
    }

    /**
     * Prepares PATCH endpoint payload, calculates changed fields.
     * @param {any} updatedRecord
     * @param {any} fetchedRecord
     * @return {any} calculated payload
     */
    async preparePatchPayload(context, { updatedRecord, fetchedRecord }) {
      let payload = updatedRecord;
      let hasChanges = true;
      if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
        // filter the object to only those top-level fields that differ from the original fetched record
        payload = Object.fromEntries(Object.entries(payload).filter(([field, value]) =>
          JSON.stringify(value) !== JSON.stringify(fetchedRecord?.[field])
        ));
        hasChanges = Object.keys(payload).length > 0;
      }

      if (!hasChanges) {
        payload = undefined;
      }

      return payload;
    }

  }

  return saveJobChain;
});
