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

  class DynamicFormTransientValueChangeChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.transientValue
     */
    async run(context, { transientValue }) {
      const { $page, $flow, $application, $variables } = context;

      $page.variables.formTransientValueText = JSON.stringify(transientValue);

      if ( transientValue.firstName && transientValue.lastName && transientValue.firstName !== null && transientValue.lastName !== null ) {
        let empData = {};
        empData.firstName = transientValue.firstName;
        empData.lastName = transientValue.lastName;
        empData.email = empData.firstName.charAt(0) +
          empData.lastName +
          "@oracle.com";

        $page.variables.employee = empData;
      }
    }
  }

  return DynamicFormTransientValueChangeChain;
});
