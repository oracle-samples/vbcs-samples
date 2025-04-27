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

  class SubmitChanges extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application } = context;

      try {
        await $page.functions.isEditingFinished();
      } catch (error) {
        // editing not finished; abort Saving process
        return;
      }

      if ($page.variables.noChangesToSave) {
        await Actions.fireNotificationEvent(context, {
          summary: 'There are no changes to save!',
          type: 'info',
          displayMode: 'transient',
        });
      } else {
        const payload = await this.createBatchPayload(context);

        await this.setStatusTo(context, "submitting");

        const batchPOSTResult = await Actions.callRest(context, {
          endpoint: 'businessObjects/batch',
          body: payload,
        });

        if (batchPOSTResult.status === 200) {

          await this.setStatusTo(context, "submitted");

          await Actions.fireNotificationEvent(context, {
            summary: 'Changes are saved!',
            type: 'info',
            displayMode: 'transient',
          });

          await Actions.resetVariables(context, {
            variables: [
              '$page.variables.editRow',
              '$page.variables.noChangesToSave',
              '$page.variables.originalRowValues',
            ],
          });

          await Actions.fireDataProviderEvent(context, {
            target: $page.variables.employeesSDP,
            refresh: null,
          });

          // workaround for JET-61016
          $page.variables.employeesBDP.instance.resetAllUnsubmittedItems();

        } else {
          const callFunctionResult = await this.setStatusTo(context, "unsubmitted");

          await Actions.fireNotificationEvent(context, {
            displayMode: 'persist',
            type: 'error',
            summary: ' Save failed. Error: '+batchPOSTResult.statusText,
          });
        }
      }
    }

    /**
     * @param {Object} context
     */
    async createBatchPayload(context) {
      const { $page, $flow, $application } = context;
    
      const generateBatchSnippet = function(url, payload, operation, id) {
        return {
          id: id ? id : "someID",
          path: url,
          operation: operation,
          payload: payload ? payload : {},
        };
      };

      let payloads = [];
      let uniqueId = new Date().getTime();
      let editItems = $page.variables.employeesBDP.instance.getSubmittableItems();

      editItems.forEach((editItem) => {
        let change = editItem.operation;
        let key = editItem.item.data.id;
        // clone record - some properties will be deleted from the clone:
        let record = JSON.parse(JSON.stringify(editItem.item.data));
        if (change === "remove") {
          payloads.push(
            generateBatchSnippet("/Employee/" + key, {}, "delete")
          );
        } else if (change === "add") {
          delete record.departmentObject;
          delete record.jobObject;
          delete record.id;
          // default some required fields:
          uniqueId = ++uniqueId;
          record.email = "person" + uniqueId + "@company.com";
          record.hireDate = new Date();
          record.department = 1;
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

    /**
     * @param {Object} context
     */
    async setStatusTo(context, status) {
      const { $page, $flow, $application } = context;
    
      let editItems = $page.variables.employeesBDP.instance.getSubmittableItems();
      editItems.forEach((editItem) => {
        $page.variables.employeesBDP.instance.setItemStatus(editItem, status);
      });
      return editItems;
    }

  }

  return SubmitChanges;
});
