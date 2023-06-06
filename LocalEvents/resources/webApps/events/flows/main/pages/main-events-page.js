/**
 * Copyright (c)2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([], () => {
  'use strict';

  class PageModule {

    /**
     *
     * @param {String} arg1
     * @return {String}
     */
    notifyClientAboutNewEvent(event, clients, thisClientId, thisUserEmail, userPreferences) {
      clients.forEach(cl => {

        if (cl.email === thisUserEmail && cl.client === thisClientId) {
          // do not notify user creating this event on this device;

          // this user will still be notified on other devices they are using
          // which is handy for testing but may not be desirable in real app - simply remove
          // the client part from the condition to NOT notify this user on any device
          return;
        }

        if (!this.userInterestedInEvent(thisUserEmail, userPreferences, event.type1)) {
          return;
        }

        const data = {
          to: cl.token,
          data: {
            eventId: event.id,
            eventName: event.name
          }
        };
        // TODO: update with your own values.
        // To find Authorization value, open FCM's Cloud Messaging 
        //  https://console.firebase.google.com/project/_/settings/cloudmessaging/
        // and under "Cloud Messaging API (Legacy)" there is Server Key value which 
        // needs to be prefixed with "key=" and pasted into Authorization header.
        // If you do not see "Cloud Messaging API (Legacy)" or Server Key value, 
        // you have not setup your project and need to do that first.
        // follow https://firebase.google.com/docs/cloud-messaging/js/client
        fetch('https://fcm.googleapis.com/fcm/send', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "key=-- replace with your own values --"
          },
          body: JSON.stringify(data)
        });

      });
    }

    userInterestedInEvent(email, preferences, preference) {
      var prefs = preferences.find(u => u.email === email);
      return (prefs === undefined || prefs.preferences.includes(""+preference));
    }

  }
  
  return PageModule;
});
