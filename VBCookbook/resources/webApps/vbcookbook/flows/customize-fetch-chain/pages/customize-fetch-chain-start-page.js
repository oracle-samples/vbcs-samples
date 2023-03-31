/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([], function () {
  'use strict';

  var PageModule = function PageModule() { };

  /**
   *
   * @param {String} data
   * @return {String}
   */
  PageModule.prototype.transformData = function (data) {
    // as part of transforming data, lets capitalize the email id
    if (data.body.items) {
      data.body.items.forEach(element => {
        element.email = element.email.toUpperCase();
      });
    }

    return data;
  };

  return PageModule;
});
