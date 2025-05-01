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

  class UpdateEmployeeChain extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application } = context;

      const ojDialog11556371901Close = await Actions.callComponentMethod(context, {
        selector: '#oj-dialog--1155637190-1',
        method: 'close',
      });

      const existsInArray = ( $page.variables.employeeListADP.data.find((e) => e.id === $page.variables.currentEmployee.id) ) === undefined ? false : true;

      if (existsInArray === true) {
        const newRow = ($page.variables.rowStatus[$page.variables.currentEmployee.id] === "inserted");

        if (newRow === false) {
          $page.variables.rowStatus[$page.variables.currentEmployee.id] = 'modified';
        }

        await Actions.fireDataProviderEvent(context, {
          target: $page.variables.employeeListADP,
          update: {
            data: [ $page.variables.currentEmployee ],
            keys: [ $page.variables.currentEmployee.id ]
          }
        });
      } else {
        $page.variables.rowStatus[$page.variables.currentEmployee.id] = 'inserted';

        await Actions.fireDataProviderEvent(context, {
          target: $page.variables.employeeListADP,
          add: {
            data: [ $page.variables.currentEmployee ],
            keys: [ $page.variables.currentEmployee.id ]
          },
        });
      }
    }
  }

  return UpdateEmployeeChain;
});
