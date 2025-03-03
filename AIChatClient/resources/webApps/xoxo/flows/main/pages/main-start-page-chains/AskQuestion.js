/**
 * Copyright (c)2025, Oracle and/or its affiliates.
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

      // OpenAI REST call payload:
      const payload = {
        messages: JSON.parse(JSON.stringify($variables.chat.data.map(i => ({role: i.role, content: i.content})))),
        model: $page.variables.model,
        store: true,
      };
      payload.messages.push({
        role: 'user',
        content: $page.variables.question,
      });

      // add question to current context (to ADP):
      this.fireDPF(context, $variables, $variables.lastId, 'user', $page.variables.question);

      // focus on new prompt:
      this.focusOnNewPrompt($variables.lastId);

      // each item needs a unique ID:
      $variables.lastId++;

      // add spinning progress icon to current context:
      this.fireDPF(context, $variables, $variables.lastId, 'assistant', "", true);

      // call OpenAI:
      const response = await Actions.callRest(context, {
        endpoint: 'completions/postCompletions',
        body: payload,
      });


      // OR, above REST call can be commented out and replaced with this
      // to just test UI without making REST calls and pay for them:
      //
      // const response = { 
      //   ok : true,
      //   body: {
      //     "choices": [
      //       {
      //         "index": 0,
      //         "message": {
      //           "role": "assistant",
      //           "content": "Certainly! Here’s an example of an answer formatted in rich text:\n\n---\n\n**Title: Benefits of Regular Exercise**\n\nRegular exercise has numerous benefits for both physical and mental health. Here are some key advantages:\n\n1. **Physical Health**: Engaging in regular physical activity can help maintain a healthy weight, improve cardiovascular health, and strengthen muscles and bones.\n\n2. **Mental Health**: Exercise is known to reduce symptoms of anxiety and depression. It releases endorphins, which can improve mood and overall well-being.\n\n3. **Increased Energy Levels**: Regular physical activity can boost your stamina and reduce feelings of fatigue.\n\n4. **Better Sleep**: Exercise can help you fall asleep faster and deepen your sleep, leading to improved rest and recovery.\n\n5. **Social Interaction**: Joining a sports team or group exercise class can foster social connections and boost your motivation to stay active.\n\n**Conclusion**: Incorporating regular exercise into your routine can lead to a healthier, happier life. Start with small, manageable goals and gradually increase your activity level.\n\n---\n\nPlease note that the formatting here is represented using Markdown-like syntax since I can't actually render rich text visually. However, if you were to paste this into a rich text editor, it would display appropriately with bold text, bullet points, and other formatting features.",
      //           "refusal": null
      //         },
      //         "logprobs": null,
      //         "finish_reason": "stop"
      //       }
      //     ],
      //   }
      // };

      if (response.ok) {
        // print the answer "word by word":
        this.simulateTypingAnswer(context, $variables, response.body.choices[0].message);

      } else {
        await Actions.fireNotificationEvent(context, {
          summary: 'REST call failed. Check network monitor for more details.',
        });
      }

      // prep session for next question:
      $variables.lastId++;
      $variables.question = "";
      $variables.busy = false;
    }

    /**
     * scrolls to user prompt identified by id:
     */
    focusOnNewPrompt(id) {
      // ensure new prompt is visible:
      const ref = "ref_"+id;
      setTimeout(()=>{
        const e = document.getElementById(ref);
        if (e) {
          e.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest"});
        }
      }, 56); // 56 is random very short number. the point is to post
              // the scrolling into browser's main thread queue so that it is done
              // after question was added into page itself
    }

    /**
     * wrapper around Actions.fireDataProviderEvent
     * to simplify repeating call
     */
    fireDPF(context, $variables, id, role, content, isBusy, isUpdate) {
      const body = {
          data: [
            {
              id: id,
              role: role,
              content: content,
              busy: isBusy
            },
          ],
          keys: [
            id,
          ],
        };
      if (isUpdate) {
        Actions.fireDataProviderEvent(context, {
          target: $variables.chat,
          update: body
        });
      } else {
        Actions.fireDataProviderEvent(context, {
          target: $variables.chat,
          add: body
        });
      }
    }

    /**
     * this adds text returned by OpenAI into the page by chunks of
     * 20 characters each 50ms. it is a fake simualation.
     * 
     * OpenAI REST endpoint supports streaming response as it is made
     * but current app is getting answers not via stream but as one blocking
     * call. 
     * 
     * supporting streaming is TBD
     */
    simulateTypingAnswer(context, $variables, message) {

      const length = message.content.length;
      let printLength = 0;
      let self = this;
      let id = $variables.lastId;
      const printSubset = function() {
        printLength += 20;
        self.fireDPF(context, $variables, id, message.role, message.content.substring(0, printLength), false, true);
      };

      let intervalHandler = setInterval(()=> {
        printSubset();
        if (printLength >= length) {
          self.fireDPF(context, $variables, id, message.role, message.content, false, true);
          clearInterval(intervalHandler);
        }
      }, 50);
    }


  }

  return AskQuestion;
});
