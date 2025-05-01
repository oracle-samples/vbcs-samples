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

  class InsertRow extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application } = context;

      $page.variables.nextIdValue = $page.variables.nextIdValue + 1;

      const key = $page.variables.nextIdValue;

      const blankRecord = {
        id: key,
        job: 0,
        jobObject: {
          items: [
            {
              jobTitle: ""
            }
          ]
        }
      };

      $page.variables.employeesBDP.instance.addItem({metadata: { key: key }, data: blankRecord});

      $page.variables.scrollPosition = {rowKey: key};

      $page.variables.editRow = {rowKey: key};
    }
  }

  return InsertRow;
});
