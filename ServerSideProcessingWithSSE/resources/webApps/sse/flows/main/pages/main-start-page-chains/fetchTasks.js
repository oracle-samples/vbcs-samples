/**
 * Copyright (c)2023, Oracle and/or its affiliates.
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

  class fetchTasks extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application } = context;

      const response = await fetch("http://127.0.0.1:8080/tasks");
      const payload = await response.json();
    
      $page.variables.tasksArray = payload.tasks;
      $page.variables.tasksArrayLive = payload.tasks;

      if (payload.tasks.length > 0) {

        const callChainApplicationStartSSEListenerResult = await Actions.callChain(context, {
          chain: 'application:startSSEListener',
        });
      }


    }
  }

  return fetchTasks;
});
