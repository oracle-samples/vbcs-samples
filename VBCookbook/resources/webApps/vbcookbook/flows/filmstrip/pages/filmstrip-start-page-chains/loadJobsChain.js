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

  class loadJobsChain extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application, $chain } = context;

      const response = await Actions.callRest(context, {
        endpoint: 'businessObjects/getall_Job',
      });

      if (!response.ok) {
        await Actions.fireNotificationEvent(context, {
          summary: response.message.summary,
        });
      } else {
        await Actions.resetVariables(context, {
          variables: [
            '$page.variables.jobs',
          ],
        });

        response.body.items.forEach(element => {
          $page.variables.jobs.push({'id':element.id, 'title':element.jobTitle});
        });

        const filmstripRefresh = await Actions.callComponentMethod(context, {
          selector: '#filmstrip',
          method: 'refresh',
        });
      }
    }
  }

  return loadJobsChain;
});
