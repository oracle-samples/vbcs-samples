/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([], function () {
  "use strict";

  class PageModule {
    constructor() {}

    getHeadersArray(responseHeaders) {
      let allHeaders = [];
      let entries = responseHeaders.entries();

      for (const element of entries) {
        let item = {};
        item.key = element[0]; // header name
        item.value = element[1]; // header value
        allHeaders.push(item);
      }

      return allHeaders;
    }
  }

  return PageModule;
});
