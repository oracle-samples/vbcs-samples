/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define(['ojs/ojarraytreedataprovider', 'vb/BusinessObjectsTransforms'], function (ArrayTreeDataProvider, BOTransforms) {
  'use strict';

  var PageModule = function PageModule() { };

  PageModule.prototype.getName = function (context) {
    return context.data.firstName + ' ' + context.data.lastName + ' ' + context.data.phoneNumber;
  };

  PageModule.prototype.getDepartmentTreeData = function (data) {
    var treeDataProvider;
    treeDataProvider = new ArrayTreeDataProvider(
      data, {
      keyAttributes: 'value'
    }
    );
    console.log(treeDataProvider);
    return treeDataProvider;
  };

  PageModule.prototype.processFilter = function (configuration, options, transformsContext) {
    var textValue = options && options.text;

    if (transformsContext && transformsContext['vb-textFilterAttributes']) {
      var options_new = {
        op: '$or',
        criteria: [
        ]
      };

      for (var i = 0; i < transformsContext['vb-textFilterAttributes'].length; i++) {
        var itemCriterion = {};
        itemCriterion.attribute = transformsContext['vb-textFilterAttributes'][i];
        itemCriterion.op = '$co';
        itemCriterion.value = textValue;
        options_new.criteria.push(itemCriterion);
      }

      // - NOTE -
      // below assignment override any existing FilterCriterion set on SDP.
      // proper solution is to merge options_new into existing conditions
      options = options_new;
    }

    return BOTransforms.request.filter(configuration, options);
  };

  return PageModule;
});