/**
 * Copyright (c)2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define(['knockout', 'fndconfig/config'], function(ko) {
  'use strict';

  var eventHelper;
  var canNotify = false;

  var token = ko.observable();

  var machineId = localStorage.getItem('MachineId');
  if (!machineId) {
    machineId = crypto.randomUUID();
    localStorage.setItem('MachineId', machineId);
  }

  class AppModule {

    constructor(context) {
      eventHelper = context.getEventHelper();
    }

    getToken() {
      return token;
    }

    getThisClientId() {
      return machineId;
    }

    startFirebase(path) {

      // Your web app's Firebase configuration
      const firebaseConfig = {
        // TODO: update with your own values
        // To find these values, open FCM's General tab of your project settings:
        //  https://console.firebase.google.com/project/_/settings/general/
        // and under "Your Apps -> Web Apps" there is "SDK setup and configuration"
        // which list below variables with your project values.
        // If you do not see "Web Apps" 
        // you have not setup your project and need to do that first.
        // follow https://firebase.google.com/docs/cloud-messaging/js/client
        apiKey: "-- replace with your own values --",
        authDomain: "-- replace with your own values --",
        projectId: "-- replace with your own values --",
        storageBucket: "-- replace with your own values --",
        messagingSenderId: "-- replace with your own values --",
        appId: "-- replace with your own values --",
        measurementId: "-- replace with your own values --"
      };

      const app = window.VB_FB.initializeApp(firebaseConfig);

      const messaging = window.VB_FB.getMessaging(app);

      window.VB_FB.onMessage(messaging, (payload) => {
        console.log('>>> AIII TOKEN Message received. ', JSON.stringify(payload));
        eventHelper.fireCustomEvent("notification", payload.data);
      });

      function resetUI() {
        
        navigator.serviceWorker.register(path + "firebase-messaging-sw.js").then((registration) => {

          // TODO: update with youy FCM vapidKEY
          // To find vapidKey value, open FCM's Cloud Messaging 
          //  https://console.firebase.google.com/project/_/settings/cloudmessaging/
          // and under "Web Configuration -> Web Push Certificates" there is Key Pair value
          // which is your vapidKey
          // If you do not see "Web Push Certificates", 
          // you have not setup your project and need to do that first.
          // follow https://firebase.google.com/docs/cloud-messaging/js/client
          window.VB_FB.getToken(messaging, {
            vapidKey:
              '-- replace with your own values --', serviceWorkerRegistration:
              registration

          }).then((currentToken) => {
            if (currentToken) {
              // Send the token to your server and update the UI if necessary
              console.log('>>> Collected Token:');
              console.log(currentToken);
              token(currentToken);
              eventHelper.fireCustomEvent("token", { token: currentToken, client: machineId });

            } else {
              // Show permission request UI
              console.log('>>> No registration token available. Request permission to generate one.');
              // ...
            }
          }).catch((err) => {
            console.log('>>> An error occurred while retrieving token. ', err);
            // ...
          });


        });

      }

      function requestPermission() {
        console.log('Requesting permission...');
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            console.log('Notification permission granted.');
            canNotify = true;
            resetUI();
          } else {
            console.log('Unable to get permission to notify.');
          }
        });
      }

      requestPermission();
    }

  }

  return AppModule;
});
