/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([], function () {
  'use strict';

  var PageModule = function PageModule() { };

  PageModule.prototype.generateEmail = function (transientValue) {
    transientValue.email = (transientValue.firstName).charAt(0) + transientValue.lastName + "@oracle.com";
    return transientValue;
  };

  return PageModule;
});
