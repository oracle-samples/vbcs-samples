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

      const createImageBitmap = await window.createImageBitmap(files[0]);

      $page.variables.scannedData = 'No Data';

      const barcode = await Actions.barcode(context, {
        image: createImageBitmap,
      });

      $page.variables.scannedData = barcode.rawValue;
    }
  }

  return FilePickerSelectChain;
});
