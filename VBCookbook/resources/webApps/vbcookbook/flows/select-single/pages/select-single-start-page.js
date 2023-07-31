/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([
  "ojs/ojarraytreedataprovider",
  "vb/BusinessObjectsTransforms",
], function (ArrayTreeDataProvider, BOTransforms) {
  "use strict";

  class PageModule {
    constructor() {}

    getName(context) {
      return (
        context.data.firstName +
        " " +
        context.data.lastName +
        " " +
        context.data.phoneNumber
      );
    }

    getDepartmentTreeData(data) {
      let treeDataProvider;
      treeDataProvider = new ArrayTreeDataProvider(data, {
        keyAttributes: "value",
      });
      return treeDataProvider;
    }

    processFilter(configuration, optionsParam, transformsContext) {
      let options = optionsParam;
      let textValue = optionsParam && optionsParam.text;

      if (transformsContext && transformsContext["vb-textFilterAttributes"]) {
        let options_new = {
          op: "$or",
          criteria: [],
        };

        for (
          let i = 0;
          i < transformsContext["vb-textFilterAttributes"].length;
          i++
        ) {
          let itemCriterion = {};
          itemCriterion.attribute =
            transformsContext["vb-textFilterAttributes"][i];
          itemCriterion.op = "$co";
          itemCriterion.value = textValue;
          options_new.criteria.push(itemCriterion);
        }

        // - NOTE -
        // below assignment override any existing FilterCriterion set on SDP.
        // proper solution is to merge options_new into existing conditions
        options = options_new;
      }

      return BOTransforms.request.filter(configuration, options);
    }
  }

  return PageModule;
});
