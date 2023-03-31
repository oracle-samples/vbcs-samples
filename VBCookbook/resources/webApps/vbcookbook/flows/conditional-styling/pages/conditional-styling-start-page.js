/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([], function () {
  'use strict';

  var PageModule = function PageModule() { };

  PageModule.prototype.getRatingColor = function (value) {
    if (value >= 0 && value <= 1) {
      return 'red';
    } else if (value > 1 && value <= 2) {
      return 'pink';
    } else if (value > 2 && value <= 3) {
      return 'orange';
    } else if (value > 3 && value <= 4) {
      return 'blue';
    } else if (value > 4) {
      return 'green';
    }
  }

  return PageModule;
});
