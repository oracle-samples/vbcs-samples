/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define(["ojs/ojarraytreedataprovider"], function (ArrayTreeDataProvider) {
  "use strict";

  class PageModule {
    constructor() {}

    buildDept(myarray) {
      return new ArrayTreeDataProvider(myarray, {
        keyAttributes: "id",
        keyAttributesScope: "siblings",
        childrenAttribute: "employeeCollection.items",
      });
    }
  }

  return PageModule;
});
