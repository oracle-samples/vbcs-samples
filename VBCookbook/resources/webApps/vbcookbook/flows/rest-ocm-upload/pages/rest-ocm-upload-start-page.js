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
     * Create object URL which can be rendered in <img> or <object> tags
     */
    preview(blobData, contentTypeParam) {
      let contentType = contentTypeParam;
      if (contentType === undefined || contentType.length === 0) {
        contentType = "application/octet-stream";
      }
      let newBlob = new Blob([blobData], {
        type: contentType,
      });
      return URL.createObjectURL(newBlob);
    }
  }

  return PageModule;
});
