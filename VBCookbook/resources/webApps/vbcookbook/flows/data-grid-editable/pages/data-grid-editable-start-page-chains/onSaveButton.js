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

  class onSaveButton extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application, $chain } = context;

      const editingCompleted = await $page.functions.isEditingCompleted();

      function generateBatchSnippet(url, payload, operation, id) {
        return {
          id: id ? id : "someID",
          path: url,
          operation: operation,
          payload: payload ? payload : {},
        };
      }

      function validateRecord(record) {
        if (
          record.firstName === undefined ||
          record.lastName === undefined ||
          record.job === undefined ||
          record.salary === undefined ||
          record.salary < record.jobObject.items[0].minSalary ||
          record.salary > record.jobObject.items[0].maxSalary
        ) {
          return false;
        }
        return true;
      }

      function setItemStatus(editItem, status, error) {
        $page.variables.bufferingDP.setItemStatus(editItem, status, error);
      }

      // Setting the status of saved items to 'submitting'
      function setStatusToSubmitting() {
        let editItems = $page.variables.bufferingDP.getSubmittableItems();
        editItems.forEach((editItem) => {
          setItemStatus(editItem, "submitting");
        });
        return editItems;
      }

      // Setting the status of saved items to 'submitted'
      function setStatusToSubmitted(submittableItems) {
        submittableItems.forEach((editItem) => {
          setItemStatus(editItem, "submitted");
        });
      }

      // Setting the status of saved items to 'unsubmitted'
      function setStatusToUnsubmitted(unsubmittableItems) {
        unsubmittableItems.forEach((editItem) => {
          setItemStatus(editItem, "unsubmitted");
        });
      }

      function createBatchPayload( bufferingDP ) {
        let isInvalidData = false;
        let payloads = [];
        let uniqueId = new Date().getTime();
        let editItems = bufferingDP.getSubmittableItems();
        editItems.forEach((editItem) => {
          // validate the record
          if (!validateRecord(editItem.item.data)) {
            isInvalidData = true;
            return;
          }

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

        if (isInvalidData) {
          return "error";
        }

        if (payloads.length > 0) {
          return {
            parts: payloads,
          };
        }

        return "nodata";
      }

      if (editingCompleted === true) {
        const createBatchPayloadReturn = await createBatchPayload( $page.variables.bufferingDP );

        if (createBatchPayloadReturn === "error") {
          await Actions.fireNotificationEvent(context, {
            message: 'Please correct the data marked in red and submit again.',
            summary: 'Invalid Data',
            displayMode: 'transient',
          });
        } else {
          if (createBatchPayloadReturn === "nodata") {
            await Actions.fireNotificationEvent(context, {
              message: 'There is no data to submit.',
              summary: 'No data',
              type: 'info',
              displayMode: 'transient',
            });
          } else {
            const setStatusToSubmittingReturn = await setStatusToSubmitting();

            const response = await Actions.callRest(context, {
              endpoint: 'businessObjects/batch',
              body: createBatchPayloadReturn,
            });

            if (!response.ok) {
              await setStatusToUnsubmitted(setStatusToSubmittingReturn);

              await Actions.fireNotificationEvent(context, {
                summary: response.message.summary,
                displayMode: 'transient',
              });
            } else {
              await setStatusToSubmitted(setStatusToSubmittingReturn);

              await Actions.fireNotificationEvent(context, {
                summary: 'Changes are saved !!',
                displayMode: 'transient',
                type: 'confirmation',
              });
            }
          }
        }
      }
    }
  }

  return onSaveButton;
});
