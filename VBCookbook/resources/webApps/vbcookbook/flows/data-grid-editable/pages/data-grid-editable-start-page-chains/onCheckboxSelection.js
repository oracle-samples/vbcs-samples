/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
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

  class onCheckboxSelection extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {object} params.value 
     * @param {object} params.current
     */
    async run(context, { value, current }) {
      const { $page, $flow, $application } = context;

      const rowData = Object.assign({}, current.item.metadata.rowItem.data);
      const reviewTicked = value.length > 0 ? 'yes' : 'no';
      rowData.review = reviewTicked;

      const callFunctionResult = await $page.functions.updateReview(rowData);
    }
  }

  return onCheckboxSelection;
});
