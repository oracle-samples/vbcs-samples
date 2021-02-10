/**
 * Copyright (c)2020, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([], function () {
  'use strict';

  var PageModule = function PageModule() { };
  PageModule.prototype.getRatingColor = function (value) {
    if (value >= 0 && value <= 1) {
      return { backgroundColor: '#ff4545', color: 'white'}
    } else if (value > 1 && value <= 2) {
      return { backgroundColor: '#ffa534', color: 'white'}
    } else if (value > 2 && value <= 3) {
      return { backgroundColor: '#ffe234', color: 'white'}
    } else if (value > 3 && value <= 4) {
      return { backgroundColor: '#b7dd29', color: 'black'}
    } else if (value > 4) {
      return { backgroundColor: '#57e32c', color: 'black'}
    }
  }
  return PageModule;
});
