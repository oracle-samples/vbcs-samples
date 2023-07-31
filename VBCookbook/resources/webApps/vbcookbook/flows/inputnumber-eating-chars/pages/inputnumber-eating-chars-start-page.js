/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([], function () {
  "use strict";

  class PageModule {
    constructor() {}

    isValidChar(event) {
      let charCode = event.which ? event.which : event.keyCode;
      let char = String.fromCharCode(charCode);
      // Only allow ".0123456789" (and non-display characters)
      let replacedValue = char.replace(/[^0-9.]/g, "");
      if (char !== replacedValue) {
        return false;
      }

      return true;
    }
  }

  return PageModule;
});
