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
     * Create object URL which can be rendered in <img> or <object> tags
     */
    preview(blobData, contentType) {
      if (contentType === undefined || contentType.length === 0) {
        contentType = "application/octet-stream";
      }
      var newBlob = new Blob([blobData], {
        type: contentType,
      });
      return URL.createObjectURL(newBlob);
    }

    /**
     * Download content of blobData as a file. Downloaded filename can be specified
     * using fileName param.
     */
    download(blobData, contentType, fileName) {
      var element = document.createElement("a");
      element.setAttribute("href", this.preview(blobData, contentType));
      element.setAttribute("download", fileName);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  }

  return PageModule;
});
