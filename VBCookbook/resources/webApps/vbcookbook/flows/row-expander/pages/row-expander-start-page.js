/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define(['knockout', 'ojs/ojflattenedtreedataproviderview', 'ojs/ojarraytreedataprovider',
  'ojs/ojknockouttemplateutils'],
  function (ko, FlattenedTreeDataProviderView, ArrayTreeDataProvider, KnockoutTemplateUtils) {
    'use strict';

    var PageModule = function PageModule() {
      this.dataSource = ko.observable();
      this.KnockoutTemplateUtils = KnockoutTemplateUtils;

    };

    PageModule.prototype.convertArrayIntoTree = function (employeeArray) {
      var empPerManager = {};
      var ceo;
      employeeArray.forEach(e => {
        if (e.manager === undefined || e.manager === null || e.manager === 0) {
          ceo = e;
        } else {
          if (empPerManager[e.manager] === undefined) {
            empPerManager[e.manager] = [];
          }
          empPerManager[e.manager].push(e);
        }
      });
      var r = [];

      var addEmployee = function (emp, result) {
        var element = emp;
        result.push(element);
        if (empPerManager[emp.id] !== undefined) {
          var children = [];
          empPerManager[emp.id].forEach(e => addEmployee(e, children));
          element.children = children;
        }
      }
      addEmployee(ceo, r);
      return r;
    }

    PageModule.prototype.updateTreeDataProvider = function (employeeArray) {
      var tree = this.convertArrayIntoTree(employeeArray);
      var arrayTreeDataProvider = new ArrayTreeDataProvider(tree, { keyAttributes: 'id' });
      this.dataSource(new FlattenedTreeDataProviderView(arrayTreeDataProvider));
    }
    PageModule.prototype.getTreeDataProvider = function () {
      return this.dataSource;
    }

    return PageModule;
  });
