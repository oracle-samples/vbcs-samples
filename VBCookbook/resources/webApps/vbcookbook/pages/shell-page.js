/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([
  'text!resources/LICENSE-download.txt'
], function(license) {
  'use strict';

  const PageModule = function PageModule() {};

  PageModule.prototype.wait = function (ms) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  };

  

  

  PageModule.prototype.getLicense = function () {
    return license;
  };

  return PageModule;
});
