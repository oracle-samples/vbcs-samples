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

  class createNewEmployeeChain extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application, $chain } = context;

      const validateForm = await $page.functions.validateForm('create-form');

      if (validateForm) {
        $page.variables.createSkill.forEach(element => {
          $page.variables.newEmployee.employeeSkillCollection.push({ "skill": element });
        });

        const response = await Actions.callRest(context, {
          endpoint: 'businessObjects/create_Employee',
          body: $page.variables.newEmployee,
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

          const dialogCreateEmployeeClose = await Actions.callComponentMethod(context, {
            selector: '#dialog-create-employee',
            method: 'close',
          });
        }
      }
    }
  }

  return createNewEmployeeChain;
});
