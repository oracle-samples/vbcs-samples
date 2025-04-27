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

  class SaveEmployeeDataActionChain extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application, $chain } = context;

      function validate_form(arg1) {
        const el = document.getElementById(arg1);
        if (el.valid === "valid") {
          return true;
        } else {
          el.showMessages();
          el.focusOn("@firstErrorShown");
          return false;
        }
      }

      // Validity_tracker
      const validateForm = await validate_form('form_edit');

      if (validateForm) {
        const response = await Actions.callRest(context, {
          endpoint: 'businessObjects/update_Employee',
          uriParams: {
            'Employee_Id': $page.variables.employee_ID,
          },
          body: $page.variables.editEmployeeDetails,
        });

        if (!response.ok) {
          await Actions.fireNotificationEvent(context, {
            summary: response.message.summary,
          });
        } else {
          await Actions.navigateBack(context, {
          });
        }
      }
    }
  }

  return SaveEmployeeDataActionChain;
});
