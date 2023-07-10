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
     * Convert binary file into Base64 string for FA upload
     */
    getBase64StringFromFile(file) {
      return new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          // reader.result will be "data:image/png;base64,iVBORw0KGgoAAAANSU......"
          var index = reader.result.indexOf(";base64,");
          var result = {
            base64: reader.result.slice(index + 8),
            contentType: reader.result.slice(5, index),
          };
          resolve(result);
        };
        reader.onerror = function (error) {
          reject(error);
        };
      });
    }

    /**
     * Extract attachment ID from self-ref URL
     */
    getRealAttachedDocumentId(row) {
      var href = row.links[0].href;
      var index =
        href.indexOf("/child/Attachments/") + "/child/Attachments/".length;
      return href.slice(index);
    }

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
