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

  class saveEmployeeChain extends ActionChain {

    /**
     * Saves Employee record data
     * @param {Object} context
     * @param {Object} params
     * @param {string} params.employeeId 
     */
    async run(context, { employeeId = '100' }) {
      const { $page, $flow, $application, $constants, $variables } = context;

      // Updates form status to Pending.
      $variables.employeeEditFormLoadingStatus = 'pending';

      try {
        // Validates Employee form
        const validateFormResult = await Actions.callChain(context, {
          chain: 'flow:validateFormChain',
          params: {
            validationGroupId: 'employee-validation-group--201013767-1',
          },
        }, { id: 'validateEmployee' });

        if (!validateFormResult) {
          return;
        }

        const payload = await this.preparePatchPayload(context, {
          updatedRecord: $variables.employee,
          fetchedRecord: $variables.fetchedEmployee,
        });

        if (payload === undefined) {
          // Return from the action chain when there are no changes to save
          return;
        }

        // Initiates REST call saving Employee data
        const callRestResult = await Actions.callRest(context, {
          body: payload,
          endpoint: 'businessObjects/update_Employee',
          headers: $variables.employeeETag ? { 'If-Match': $variables.employeeETag } : null,
          requestType: 'json',
          uriParams: {
            'Employee_Id': employeeId,
          },
        }, { id: 'saveEmployee' });

        if (!callRestResult.ok) {
          // Create error message
          const errorMessage = callRestResult.body?.detail || callRestResult.body?.['o:errorDetails']?.[0]?.detail || `Could not edit Employee: status ${callRestResult.status}`;
          // Fires a notification event about failed save
          await Actions.fireNotificationEvent(context, {
            summary: 'Save failed',
            message: errorMessage,
          }, { id: 'fireErrorNotification' });

          return;
        }

        // Fires a notification event about successful save
        await Actions.fireNotificationEvent(context, {
          summary: 'Employee saved',
          message: 'Employee record successfully updated',
          displayMode: 'transient',
          type: 'confirmation',
        }, { id: 'fireSuccessNotification' });

        // Calls action chain re-loading Employee data
        await Actions.callChain(context, {
          chain: 'loadEmployeeChain',
          params: {
            fetchedFields: $variables.employeeEditFormRenderedFields,
          },
        }, { id: 'callLoadEmployeeChain' });
      } finally {
        // Updates form status to Ready.
        $variables.employeeEditFormLoadingStatus = 'ready';
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

  return saveEmployeeChain;
});
