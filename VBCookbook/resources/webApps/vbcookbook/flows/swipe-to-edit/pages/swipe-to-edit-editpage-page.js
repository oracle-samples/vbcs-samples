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
   * @param {String} arg1
   * @return {String}
   */
  PageModule.prototype.validate_form = function (arg1) {
    const el = document.getElementById(arg1);
    if (el.valid === "valid") {
      return true;
    } else {
      el.showMessages();
      el.focusOn('@firstErrorShown');
      return false;
    }
  };

  return PageModule;
});
