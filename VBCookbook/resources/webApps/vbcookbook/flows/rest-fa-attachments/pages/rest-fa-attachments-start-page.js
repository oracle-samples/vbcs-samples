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
     * Extract attachment ID from self-ref URL
     */
    getRealAttachedDocumentId(row) {
      let href = row.links[0].href;
      let index =
        href.indexOf("/child/Attachments/") + "/child/Attachments/".length;
      return href.slice(index);
    }

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

    /**
     * Download content of blobData as a file. Downloaded filename can be specified
     * using fileName param.
     */
    download(blobData, contentType, fileName) {
      let element = document.createElement("a");
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
