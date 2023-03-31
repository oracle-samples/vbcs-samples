/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([], function() {
  'use strict';

  var PageModule = function PageModule() {};

  PageModule.prototype.getName = function(context) {
    // debugger;
    var name = context.data.firstName + ' ' + context.data.lastName;
    if (context.data.managerObject && context.data.managerObject.items.length > 0) {
      name += " (reports to "+ context.data.managerObject.items[0].lastName + ")";
    }
    return name;
  }

  return PageModule;
});