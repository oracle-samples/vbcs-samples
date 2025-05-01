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

  class saveActionChain extends ActionChain {
    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application } = context;

      // create a batch payload for the unsubmitted items
      const batchRESTPayload = await this.createBatchPayload(context);

      // check if there is any modified/added data available
      if (batchRESTPayload.parts.length === 0) {
        await Actions.fireNotificationEvent(context, {
          displayMode: 'transient',
          type: 'info',
          summary: 'Nothing to save.',
        });
      } else {
        // call the batch rest call
        const batchPostResult = await Actions.callRest(context, {
          endpoint: 'businessObjects/batch',
          body: batchRESTPayload,
        });

        if (batchPostResult.status === 200) {
          $page.variables.employeesCustomBDP.instance.resetAllUnsubmittedItems();

          await Actions.fireNotificationEvent(context, {
            summary: 'Changes are saved.',
            displayMode: 'transient',
            type: 'confirmation',
          });
        } else {
          await Actions.fireNotificationEvent(context, {
            displayMode: 'persist',
            type: 'error',
            summary: ' Save failed. Error: ' + batchPostResult.statusText,
          });
        }
      }
    }

    /**
     * @param {Object} context
     */
    async createBatchPayload(context) {
      const { $page, $flow, $application } = context;
      const generateBatchSnippet = function (url, payload, operation, id) {
        return {
          id: id ? id : "someID",
          path: url,
          operation: operation,
          payload: payload ? payload : {},
        };
      };
      let payloads = [];
      let uniqueId = new Date().getTime();
      let editItems = $page.variables.employeesCustomBDP.instance.getSubmittableItems();
      editItems.forEach((editItem) => {
        let change = editItem.operation;
        let key = editItem.item.metadata.key;
        // clone record - some properties will be deleted from the clone:
        let record = JSON.parse(JSON.stringify(editItem.item.data));
        if (change === "remove") {
          payloads.push(
            generateBatchSnippet("/Employee/" + key, {}, "delete")
          );
        } else if (change === "add") {
          //delete record.departmentObject;
          //delete record.jobObject;
          //delete record.id;
          // default some required fields:
          // record.email = 'person' + (++uniqueId) + '@company.com';
          record.hireDate = new Date();
          record.department = 1;
          record.job = 1;
          payloads.push(
            generateBatchSnippet("/Employee", record, "create")
          );
        } else if (change === "update") {
          delete record.departmentObject;
          delete record.jobObject;
          payloads.push(
            generateBatchSnippet(
              "/Employee/" + key,
              record,
              "update"
            )
          );
        }
      });
      return {
        parts: payloads,
      };
    }
  }

  return saveActionChain;
});
