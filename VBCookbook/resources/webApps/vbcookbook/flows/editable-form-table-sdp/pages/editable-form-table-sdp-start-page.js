/**
 * Copyright (c)2020, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define(['jsondiff'], function(JsonDiffPlugin) {
  'use strict';

  var PageModule = function PageModule() {};

  var JSON_DIFF = JsonDiffPlugin.create({
    arrays: {
      detectMove: false,
    },
    cloneDiffValues: false,
  });
  
  PageModule.prototype.areDifferent = function(oldValue, newValue) {
    
    var diff = JSON_DIFF.diff(oldValue, newValue);
    return diff !== undefined;
  };
  return PageModule;
});
