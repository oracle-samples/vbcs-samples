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

  class NextActionChain extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application } = context;

      function map(steps, idToMatch) {
        return steps.map(s=> s.id === idToMatch ? { ...s, disabled: false }: s);
      }

      if ($page.variables.selectedStep === '1') {
        $page.variables.steps = map($page.variables.steps,'2');
        $page.variables.selectedStep = 2;
        $page.variables.currentJobTitle = $page.variables.selectedEmployeeItem.data.jobObject.items[0].jobTitle;
      } else if ($page.variables.selectedStep === '2') {
        const selectJobValidate = await Actions.callComponentMethod(context, {
          selector: '#select-job',
          method: 'validate',
        });

        if (selectJobValidate !== 'invalid') {
          $page.variables.steps = map($page.variables.steps, '3');
          $page.variables.selectedStep = 3;
        }
      }
    }
  }

  return NextActionChain;
});
