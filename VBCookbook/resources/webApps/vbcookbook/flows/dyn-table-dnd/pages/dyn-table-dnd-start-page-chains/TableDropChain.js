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

  class handleDrop extends ActionChain {

    /**
     * Manipulate ADP data and update it.
     * @param {Object} context
     * @param {Object} params
     * @param {object} params.event 
     */
    async run(context, { event }) {
      const { $page, $flow, $application } = context;

      let data = $page.variables.employeeDropListADP.data;

      const addData = data
        .slice(0, event.startIndex)
        .concat(event.rows)
        .concat(data.slice(event.startIndex));

      $page.variables.employeeDropListADP.data = addData;
    }
  }

  return handleDrop;
});
