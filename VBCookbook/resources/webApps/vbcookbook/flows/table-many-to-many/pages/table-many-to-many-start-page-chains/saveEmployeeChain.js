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
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application, $chain } = context;

      function generateBatchSnippet(url, payload, operation, id) {
        return {
          id: id ? `part-${id}` : "someID",
          path: url,
          operation: operation,
          payload: payload ? payload : {},
        };
      }

      function batchPayloadForEdit(employee, selectedSkills) {
        let skillsToDelete = employee.employeeSkillCollection.items
          .filter((q) => selectedSkills.indexOf(q.skill) === -1)
          .map((q) => q.id);
        let originalSkills = employee.employeeSkillCollection.items.map(
          (q) => q.skill
        );
        let skillsToAdd = selectedSkills.filter(
          (q) => originalSkills.indexOf(q) === -1
        );

        let payloads = [];
        payloads.push( generateBatchSnippet(
            "/Employee/" + employee.id,
            {
              firstName: employee.firstName,
            },
            "update",
            "employee"
          )
        );
        payloads = payloads.concat(
          skillsToAdd.map((q) => generateBatchSnippet(
              "/Employee/" + employee.id + "/child/employeeSkillCollection",
              {
                skill: q,
              },
              "create",
              q
            )
          ),
          skillsToDelete.map((q) => generateBatchSnippet(
              "/Employee/" + employee.id + "/child/employeeSkillCollection/" + q,
              {},
              "delete",
              q
            )
          )
        );

        return {
          parts: payloads,
        };
      }

      const validateForm = await $page.functions.validateForm('edit-form');

      if (validateForm) {
        const batchPayloadForEditReturn = await batchPayloadForEdit($page.variables.currentEmployee, $page.variables.currentSkills);

        const response = await Actions.callRest(context, {
          endpoint: 'businessObjects/batch',
          body: batchPayloadForEditReturn,
        });

        if (!response.ok) {
            await Actions.fireNotificationEvent(context, {
              summary: response.message.summary,
            });
        } else {
          await Actions.fireDataProviderEvent(context, {
            target: $page.variables.employeeListSDP,
            refresh: null,
          });

          await Actions.fireNotificationEvent(context, {
            summary: 'Saved Successfully',
            displayMode: 'transient',
            type: 'confirmation',
          });

          const dialogEditEmployeeClose = await Actions.callComponentMethod(context, {
            selector: '#dialog-edit-employee',
            method: 'close',
          });
        }
      }
    }
  }

  return saveEmployeeChain;
});
