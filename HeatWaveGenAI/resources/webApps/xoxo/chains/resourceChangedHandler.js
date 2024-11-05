/**
 * Copyright (c)2024, Oracle and/or its affiliates.
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

  class resourceChangedHandler extends ActionChain {

    /**
      * Displays a notification message when application has been updated and needs to be refreshed.
      * @param {Object} context
      * @param {Object} params
      * @param {{error: {detail: string}}} params.event
      */
    async run(context, { event = {} }) {
      const { $application } = context;

      await Actions.fireNotificationEvent(context, {
        summary: event.error.detail,
      });
    }
  }

  return resourceChangedHandler;
});