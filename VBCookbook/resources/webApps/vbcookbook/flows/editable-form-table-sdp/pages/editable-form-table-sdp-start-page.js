/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([], function() {
  'use strict';

  var PageModule = function PageModule() {};

  PageModule.prototype.areDifferent = function(oldValue, newValue) {
    if(JSON.stringify(newValue) === JSON.stringify(oldValue))
    return false
    else 
    return true;
  };

  return PageModule;
});
