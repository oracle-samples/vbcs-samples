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

  class vbEnterListener extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application, $constants, $variables } = context;

      // for testing of UI only:

      // const x = [
      //   {
      //     "role": "user",
      //     "content": "What is the date today?"
      //   },
      //   {
      //     "role": "assistant",
      //     "content": "Today's date is October 3, 2023."
      //   },
      //   {
      //     "role": "user",
      //     "content": "Are you sure?"
      //   },
      //   {
      //     "role": "assistant",
      //     "content": "I apologize for the confusion. As an AI, I don't have real-time capabilities or access to current date information. My training data goes up until October 2021. To find today's date, please refer to your device's calendar or a trusted date source."
      //   },
      //   {
      //     "role": "user",
      //     "content": "That makes sense. Thx"
      //   },
      //   {
      //     "role": "assistant",
      //     "content": "You're welcome! If you have any more questions or need assistance with anything else, feel free to ask!"
      //   },
      //   {
      //     "role": "user",
      //     "content": "Can you give me an example of answer formatted in rich text?"
      //   },
      //   {
      //     "role": "assistant",
      //     "content": "Certainly! Here’s an example of an answer formatted in rich text:\n\n---\n\n**Title: Benefits of Regular Exercise**\n\nRegular exercise has numerous benefits for both physical and mental health. Here are some key advantages:\n\n1. **Physical Health**: Engaging in regular physical activity can help maintain a healthy weight, improve cardiovascular health, and strengthen muscles and bones.\n\n2. **Mental Health**: Exercise is known to reduce symptoms of anxiety and depression. It releases endorphins, which can improve mood and overall well-being.\n\n3. **Increased Energy Levels**: Regular physical activity can boost your stamina and reduce feelings of fatigue.\n\n4. **Better Sleep**: Exercise can help you fall asleep faster and deepen your sleep, leading to improved rest and recovery.\n\n5. **Social Interaction**: Joining a sports team or group exercise class can foster social connections and boost your motivation to stay active.\n\n**Conclusion**: Incorporating regular exercise into your routine can lead to a healthier, happier life. Start with small, manageable goals and gradually increase your activity level.\n\n---\n\nPlease note that the formatting here is represented using Markdown-like syntax since I can't actually render rich text visually. However, if you were to paste this into a rich text editor, it would display appropriately with bold text, bullet points, and other formatting features."
      //   },
      //   {
      //     "role": "user",
      //     "content": "Perfect. Thx"
      //   }
      // ];

      // let y = 0;
      // x.forEach(i => {
      //   i.id = y;
      //   y++;
      //   i.busy = false;
      // });
      // $variables.chat.data = x;
      // $variables.lastId = y;
    }
  }

  return vbEnterListener;
});
