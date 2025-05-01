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

  class SaveButtonActionChain extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application, $chain } = context;

      function generateBatchSnippet(url, payload, operation, id) {
        return {
          id: "part" + id,
          path: url,
          operation: operation,
          payload: payload ? payload : {},
        };
      }

      function prepareDepartmentBatchPayload(newdepname, originaldepname, depid) {
        let payload = [];

        if (newdepname !== originaldepname) {
          payload.push( generateBatchSnippet(
              "/Department/" + depid,
              {
                departmentName: newdepname,
              },
              "update",
              "dep" + depid
            )
          );
        }

        return payload;
      }

      function prepareEmployeesBatchPayload(employeeArray, rowStatus, payload) {
        Object.keys(rowStatus).forEach((keyParam) => {
          let key = parseInt(keyParam,10); // the field is actually numeral

          let change = rowStatus[key];
          let record = employeeArray.find((e1) => e1.id === key);

          if (change === "inserted") {
            record.hireDate = new Date(); // mandatory field
            record.job = 1; // mandatory field
            payload.push( generateBatchSnippet("/Employee/", record, "create", key)
            );
          } else if (change === "modified") {
            payload.push( generateBatchSnippet(
                "/Employee/" + key,
                record,
                "update",
                key
              )
            );
          } else if (change === "deleted") {
            payload.push( generateBatchSnippet(
                "/Employee/" + key,
                {},
                "delete",
                key
              )
            );
          }
        });

        if (payload.length > 0) {
          return {
            parts: payload,
          };
        }

        return undefined;
      }

      const prepareDepartmentBatchPayloadReturn = await prepareDepartmentBatchPayload($page.variables.departmentName, $page.variables.originalDepartmentName, $page.variables.departmentId);

      const prepareEmployeesBatchPayloadReturn = await prepareEmployeesBatchPayload($page.variables.employeeListADP.data, $page.variables.rowStatus, prepareDepartmentBatchPayloadReturn);

      if ( prepareEmployeesBatchPayloadReturn === undefined ) {
        await Actions.fireNotificationEvent(context, {
          summary: 'Data Upto Date',
          message: 'Nothing to save !!',
          displayMode: 'transient',
          type: 'info',
        });
      } else {
        const response = await Actions.callRest(context, {
          endpoint: 'businessObjects/batch',
          body: prepareEmployeesBatchPayloadReturn,
        });

        if (!response.ok) {
          await Actions.fireNotificationEvent(context, {
            summary: response.message.summary,
          });
        } else {
          await Actions.fireNotificationEvent(context, {
            summary: 'Success',
            message: 'Changes saved !!',
            displayMode: 'transient',
            type: 'confirmation'
          });

          await Actions.callChain(context, {
            chain: 'FetchDepartment'
          });
        }
      }
    }
  }

  return SaveButtonActionChain;
});
