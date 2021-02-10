/**
 * Copyright (c)2020, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define(['ojs/ojarraytreedataprovider'], function(ArrayTreeDataProvider) {
  'use strict';

  var PageModule = function PageModule() {};

  PageModule.prototype.getName = function(context) {

    return context.data.firstName + ' ' + context.data.lastName;
  }



  PageModule.prototype.getDepartmentTreeData = function(data) {

    var treeDataProvider;


    treeDataProvider = new ArrayTreeDataProvider(
      data, {
        keyAttributes: 'value'
      }
    );
    console.log(treeDataProvider);
    return treeDataProvider;
  };

  return PageModule;
});