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

  class AskQuestion extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application, $constants, $variables } = context;

      $variables.busy = true;

      Actions.fireDataProviderEvent(context, {
        target: $variables.chat,
        add: {
          data: [
            {
              id: $variables.lastId,
              question: $variables.question,
            },
          ],
          keys: [
            $variables.lastId,
          ],
          // indexes: [0],
        },
      });

      const response = await Actions.callRest(context, {
        endpoint: 'AskQuestion/postAsk2',
        body: {
          question: $variables.question,
          id: $variables.ask_id,
          hash: $variables.ask_hash,
          model: $variables.model,
          tables: $variables.sources.length > 0 ? $variables.sources : undefined
        },
      });

      let answer = ["not sure; there was an error"];
      if (response.ok) {
        const ask = response.body;
        if (ask.status === "ok") {
          $variables.ask_id = ask.id;
          $variables.ask_hash = ask.hash;
          answer = ask.answer.split(/\r\n|\r|\n/g);
        } else {
          console.error(ask);
          await Actions.fireNotificationEvent(context, {
            summary: "REST call returned an errro. See console and network monitor",
          });
          answer = "there was an error processing your question: " + ask.error;
        }
      } else {
        await Actions.fireNotificationEvent(context, {
          summary: 'REST call failed. Check network monitor for more details.',
        });
      }
      Actions.fireDataProviderEvent(context, {
        target: $variables.chat,
        update: {
          data: [
            {
              id: $variables.lastId,
              question: $variables.question,
              answer: answer,
            },
          ],
          keys: [$variables.lastId],
        }
      });

      $variables.lastId++;
      $variables.question = "";
      $variables.busy = false;
    }
  }

  return AskQuestion;
});
