/**
 * Copyright (c)2020, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([
  'vb/action/actionChain',
  'vb/action/actions',
  'vb/action/actionUtils',
], (
  ActionChain,
  Actions,
  ActionUtils
) => {
  'use strict';

  class FilePickerSelectChain extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {object[]} params.files 
     */
    async run(context, { files }) {
      const { $page, $flow, $application } = context;

      function addImageFunction(file) {
        return new Promise((resolve) => {
          const blobURL = URL.createObjectURL(file);
          const reader = new FileReader();
          reader.addEventListener(
            "load",
            function () {
              // convert image file to base64 string
              resolve({
                data: reader.result,
                url: blobURL,
              });
              document.getElementById("mypic").onload = function () {
                URL.revokeObjectURL(blobURL);
              };
            },
            false
          );

          if (file) {
            reader.readAsDataURL(file);
          }
        });
      }

      const addImageFunctionReturn = await addImageFunction(files[0]);

      $page.variables.holdImage = addImageFunctionReturn.data;
      $page.variables.imageUrl = addImageFunctionReturn.url;
    }
  }

  return FilePickerSelectChain;
});
