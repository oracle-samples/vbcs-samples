/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([
  "knockout",
  "ojs/ojflattenedtreedataproviderview",
  "ojs/ojarraytreedataprovider",
  "ojs/ojknockouttemplateutils",
], function (
  ko,
  FlattenedTreeDataProviderView,
  ArrayTreeDataProvider,
  KnockoutTemplateUtils
) {
  "use strict";

  class PageModule {
    constructor() {
      this.dataSource = ko.observable();
      this.KnockoutTemplateUtils = KnockoutTemplateUtils;
    }

    convertArrayIntoTree(employeeArray) {
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

    updateTreeDataProvider(employeeArray) {
      let tree = this.convertArrayIntoTree(employeeArray);
      let arrayTreeDataProvider = new ArrayTreeDataProvider(tree, {
        keyAttributes: "id",
      });
      this.dataSource(new FlattenedTreeDataProviderView(arrayTreeDataProvider));
    }

    getTreeDataProvider() {
      return this.dataSource;
    }
  }

  return PageModule;
});
