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

  class updateProgressFragment extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {{tasks:[{id:number,length:number,name:string,progress:number,start:number}]}} params.event 
     */
    async run(context, { event }) {
      const { $page, $application } = context;
      let sum = 0;
      event.tasks.forEach(task => {
        sum += task.progress;
        if (!$page.variables.allKnownTasks.includes(task.id)) {
          $page.variables.allKnownTasks.push(task.id);
        }
      });
      const alreadyProcessed = $page.variables.allKnownTasks.length - event.tasks.length;
      $page.variables.maxVal = (alreadyProcessed + event.tasks.length)*100;
      $page.variables.value = sum + (alreadyProcessed*100);
    }
  }

  return updateProgressFragment;
});
