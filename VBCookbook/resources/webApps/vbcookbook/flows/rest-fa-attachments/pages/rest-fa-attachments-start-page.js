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
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          // reader.result will be "data:image/png;base64,iVBORw0KGgoAAAANSU......"
          let index = reader.result.indexOf(";base64,");
          let result = {
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
