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

  class updateProgress extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     * @param {{tasks:[{id:number,length:number,name:string,progress:number,start:number}]}} params.event 
     */
    async run(context, { event }) {
      const { $page, $flow, $application } = context;

      event.tasks.forEach(async task => {

        $page.variables.tasksArrayLive.find(i => i.id === task.id).progress = task.progress;

      });
      
    }
  }

  return updateProgress;
});
