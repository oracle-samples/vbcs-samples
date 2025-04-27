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

  class saveEmploymentWhenAndWhyChain extends ActionChain {

    /**
     * Saves employmentWhenAndWhy record data
     * @param {Object} context
     * @param {Object} params
     * @param {string} params.employmentWhenAndWhyId 
     */
    async run(context, { employmentWhenAndWhyId = '1' }) {
      const { $page, $flow, $application } = context;

      // Updates form status to Pending.
      $page.variables.employmentWhenAndWhyEditFormLoadingStatus = 'pending';

      try {
        // Validates employmentWhenAndWhy form
        const validateFormResult = await Actions.callChain(context, {
          chain: 'flow:validateFormChain',
          params: {
            validationGroupId: 'employmentWhenAndWhy-validation-group--2120301831-1',
          },
        }, { id: 'validateEmploymentWhenAndWhy' });

        if (!validateFormResult) {
          return;
        }

        const payload = await this.preparePatchPayload(context, {
          updatedRecord: $page.variables.employmentWhenAndWhy,
          fetchedRecord: $page.variables.fetchedEmploymentWhenAndWhy,
        });

        if (payload === undefined) {
          // Return from the action chain when there are no changes to save
          return;
        }

        // Initiates REST call saving employmentWhenAndWhy data
        const callRestResult = await Actions.callRest(context, {
          body: payload,
          endpoint: 'employmentWhenAndWhy/update_employmentWhenAndWhy',
          headers: $page.variables.employmentWhenAndWhyETag ? { 'If-Match': $page.variables.employmentWhenAndWhyETag } : null,
          requestType: 'json',
          uriParams: {
            'employmentWhenAndWhy_Id': employmentWhenAndWhyId,
          },
        }, { id: 'saveEmploymentWhenAndWhy' });

        if (!callRestResult.ok) {
          // Create error message
          const errorMessage = `Could not edit employmentWhenAndWhy: status ${callRestResult.status}`;
          // Fires a notification event about failed save
          await Actions.fireNotificationEvent(context, {
            summary: 'Save failed',
            message: errorMessage,
          }, { id: 'fireErrorNotification' });

          return;
        }

        // Fires a notification event about successful save
        await Actions.fireNotificationEvent(context, {
          summary: 'employmentWhenAndWhy saved',
          message: 'employmentWhenAndWhy record successfully updated',
          displayMode: 'transient',
          type: 'confirmation',
        }, { id: 'fireSuccessNotification' });

        // Calls action chain re-loading employmentWhenAndWhy data
        await Actions.callChain(context, {
          chain: 'loadEmploymentWhenAndWhyChain',
          params: {
            fetchedFields: $page.variables.employmentWhenAndWhyEditFormRenderedFields,
          },
        }, { id: 'callLoadEmploymentWhenAndWhyChain' });
      } finally {
        // Updates form status to Ready.
        $page.variables.employmentWhenAndWhyEditFormLoadingStatus = 'ready';
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

  return saveEmploymentWhenAndWhyChain;
});
