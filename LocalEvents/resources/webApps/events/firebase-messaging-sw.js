/**
 * Copyright (c)2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */

// Import the functions you need from the SDKs you need
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js");

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

var eventId;

const focusOrOpen = function(event, url) {
    const urlToOpen = new URL(url, self.location.origin).href;

    const promiseChain = clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    })
    .then((windowClients) => {
      let matchingClient = null;

      for (let i = 0; i < windowClients.length; i++) {
        const windowClient = windowClients[i];
        if (urlToOpen.startsWith(windowClient.url)) {
          matchingClient = windowClient;
          break;
        }
      }

      if (matchingClient) {
        // could just focus it if query params are the same:
        // matchingClient.focus();
        // unfortunately below call does not work: sw cannot change URL
        // return matchingClient.navigate(urlToOpen);
        return clients.openWindow(urlToOpen);
      } else {
        return clients.openWindow(urlToOpen);
      }
    });

    event.waitUntil(promiseChain);  
};

messaging.onBackgroundMessage((payload) => {
  // Customize notification here
  const notificationTitle = ''+payload.data.eventName;
  const notificationOptions = {
    body: "New event was created. Click to learn more about it."
  };
  eventId = payload.data.eventId;
  return self.registration.showNotification(notificationTitle, notificationOptions);

});


self.addEventListener('notificationclick', function(event) {
  const clickedNotification = event.notification;
  clickedNotification.close();
  // TODO: update "your-vb-instance-here"
  // TODO: update rt/Local_Events/1.0/webApps/events to match your app
  //       rt is for staged app
  //       1.0 is version of the app
  //       "events" is web app name
  focusOrOpen(event, "https://your-vb-instance-here/ic/builder/rt/Local_Events/1.0/webApps/events/?eventId="+eventId+"&page=shell&shell=main&main=main-event");
});
