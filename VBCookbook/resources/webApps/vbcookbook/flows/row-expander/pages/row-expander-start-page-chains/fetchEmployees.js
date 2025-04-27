/**
 * Copyright (c)2020, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([
  'vb/action/actionChain',
  'vb/action/actions',
  'vb/action/actionUtils',
  'ojs/ojflattenedtreedataproviderview',
  'ojs/ojarraytreedataprovider'
], (
  ActionChain,
  Actions,
  ActionUtils,
  FlattenedTreeDataProviderView,
  ArrayTreeDataProvider
) => {
  'use strict';

  class fetchEmployees extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application, $constants, $variables, $functions, $chain } = context;

      function convertArrayIntoTree(employeeArray) {
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

      function updateTreeDataProvider(employeeArray) {
        let tree = convertArrayIntoTree(employeeArray);
        let arrayTreeDataProvider = new ArrayTreeDataProvider(tree, {
          keyAttributes: "id"
        });
        $page.variables.dataSource = new FlattenedTreeDataProviderView(arrayTreeDataProvider);
      }

      const response = await Actions.callRest(context, {
        endpoint: 'businessObjects/getall_Employee',
        uriParams: {
          limit: 999,
        },
        responseType: 'getall_Employee',
      });

      if (response.ok) {
        await updateTreeDataProvider(response.body.items);
      } else {
        await Actions.fireNotificationEvent(context, {
          summary: response.message.summary,
        });
      }
    }
  }

  return fetchEmployees;
});
