/**
 * Copyright (c)2020, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([
  'vb/action/actionChain',
  'vb/action/actions',
  'vb/action/actionUtils',
  'ojs/ojrowdatagridprovider'
], (
  ActionChain,
  Actions,
  ActionUtils,
  RowDataGridProvider
) => {
  'use strict';

  class vbEnter extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application } = context;

      function getRowGridDataProvider(sdp) {
        return new RowDataGridProvider.RowDataGridProvider(sdp, {
          columns: {
            rowHeader: ["id"],
            databody: ["firstName", "lastName", "phoneNumber", "email", "salary"],
          },
          columnHeaders: {
            column: [
              { data: "First Name" },
              { data: "Last Name" },
              { data: "Phone Number" },
              { data: "Email" },
              { data: "Salary" },
            ],
          },
          headerLabels: {
            row: ["Id"],
          },
        });
      }
      
      const rowGridDataProvider = await getRowGridDataProvider($page.variables.employeeListSDP);

      $page.variables.data = rowGridDataProvider;
    }
  }

  return vbEnter;
});
