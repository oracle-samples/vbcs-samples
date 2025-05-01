/**
 * Copyright (c)2020, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([], function () {
  "use strict";

  class PageModule {
    constructor() {}

    /**
     *
     * @param {String} id
     * @return {String}
     */
    validateForm(id) {
      let el = document.getElementById(id);
      if (el.valid === "valid") {
        return true;
      } else {
        el.showMessages();
        el.focusOn("@firstErrorShown");
        return false;
      }
    }
  }

  return PageModule;
});
