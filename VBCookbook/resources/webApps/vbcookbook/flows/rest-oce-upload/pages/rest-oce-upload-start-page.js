/**
 * Copyright (c)2020, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([], function() {
  'use strict';

  var PageModule = function PageModule() {};

  /**
   * Create object URL which can be rendered in <img> or <object> tags
   */
  PageModule.prototype.preview = function(blobData, contentType) {
    if (contentType === undefined || contentType.length === 0) {
      contentType = "application/octet-stream";
    }
    var newBlob = new Blob([blobData], {
      type: contentType
    });
    return URL.createObjectURL(newBlob);
  };

  /**
   * Download content of blobData as a file. Downloaded filename can be specified
   * using fileName param.
   */
  PageModule.prototype.download = function(blobData, contentType, fileName) {
    var element = document.createElement('a');
    element.setAttribute('href', this.preview(blobData, contentType));
    element.setAttribute('download', fileName);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  /**
   * This function not only generates filename for taken photo but also
   * checks that file type is one ofo supported ones. Returning no filename
   * means file type is not acceptable.
   */
  PageModule.prototype.generateFileName = function(blobFile) {
    const supportedFileTypes = ["image/png", "image/jpeg", "image/gif"];
    if (supportedFileTypes.indexOf(blobFile.type) === -1) {
      return undefined;
    }
    return "Photo_" + Math.random().toString(36).substring(7).toUpperCase() +
      "." + blobFile.type.substring(6);
  };

  return PageModule;
});
