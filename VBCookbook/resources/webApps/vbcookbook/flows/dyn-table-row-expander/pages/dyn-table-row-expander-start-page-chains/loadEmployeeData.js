/**
 * Copyright (c)2020, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([
  'vb/action/actionChain',
  'vb/action/actions',
  'vb/action/actionUtils',
  "ojs/ojarraytreedataprovider"
], (
  ActionChain,
  Actions,
  ActionUtils,
  ArrayTreeDataProvider
) => {
  'use strict';

  class loadEmployeeData extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application } = context;

      const response = await Actions.callRest(context, {
        endpoint: 'businessObjects/getall_Employee',
        responseType: 'getallEmployeeResponse',
      });

      const employeeArray = response.body.items;

      const tree = await this.convertArrayIntoTree(context, { employeeArray });
      $page.variables.employeeTreeData = new ArrayTreeDataProvider(tree, {
        keyAttributes: "id",
      });

    }

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {any} params.employeeArray 
     */
    async convertArrayIntoTree(context, { employeeArray }) {
      const { $page, $flow, $application } = context;
      let empPerManager = {};
      let ceo;
      employeeArray.forEach((e) => {
        if (e.manager === undefined || e.manager === null || e.manager === 0) {
          ceo = e;
        } else {
          if (empPerManager[e.manager] === undefined) {
            empPerManager[e.manager] = [];
          }
          empPerManager[e.manager].push(e);
        }
      });
      let r = [];

      let addEmployee = function (emp, result) {
        let element = emp;
        result.push(element);
        if (empPerManager[emp.id] !== undefined) {
          let children = [];
          empPerManager[emp.id].forEach((e) => addEmployee(e, children));
          element.children = children;
        }
      };
      addEmployee(ceo, r);
      return r;
    }
  }

  return loadEmployeeData;
});
