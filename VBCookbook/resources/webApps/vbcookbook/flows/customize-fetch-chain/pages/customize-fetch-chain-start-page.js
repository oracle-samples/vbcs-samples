/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([], function () {
  "use strict";

  class PageModule {
    constructor() {}

    /**
     *
     * @param {String} data
     * @return {String}
     */
    transformData(data) {
      // as part of transforming data, lets capitalize the email id
      if (data.body.items) {
        data.body.items.forEach((element) => {
          element.email = element.email.toUpperCase();
        });
      }

      return data;
    }
  }

  return PageModule;
});
