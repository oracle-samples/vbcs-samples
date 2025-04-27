/**
 * Copyright (c)2020, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define(["ojs/ojoffcanvas", "ojs/ojconverter-number"], function (
  OffcanvasUtils,
  NumberConverter
) {
  "use strict";

  class PageModule {
    constructor() {
      this.inrNumberConverter = new NumberConverter.IntlNumberConverter({
        options: {
          style: "currency",
          currency: "INR",
        },
        type: "number",
      });
    }

    formatCurrency(data) {
      return this.inrNumberConverter.format(data);
    }

    optionRenderer(context) {
      return context.data.firstName + " " + context.data.lastName;
    }
  }

  return PageModule;
});
