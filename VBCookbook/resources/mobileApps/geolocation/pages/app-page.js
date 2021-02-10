/**
 * Copyright (c)2020, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([], () => {
  'use strict';

  class StartModule {
  }

  /**
   * Handler for PWA 'Add' button click on PWA 'add to home screen' popup
   * @return {Promise<boolean>}
   */
  StartModule.prototype.addPWA = function (installPromptEventPayload){
    // First close the popup through synchronous call
    document.getElementById('pwaAddToHomeScreen').close();
    var installPromptEvent = installPromptEventPayload.getInstallPromptEvent();
    if (installPromptEvent) {
      // Call prompt() to display the official prompt
      installPromptEvent.prompt().catch(function() {
        // In case of DOMException, ask again
        return false;
      });
      // Wait for the user to respond to the prompt
      return installPromptEvent.userChoice.then(function(choiceResult) {
        if (choiceResult.outcome === 'accepted') {
          console.log('user accepted the A2HS prompt');
        } else {
          console.log('user cancelled the A2HS prompt');
        }

        // Don't ask the user again
        return true;
      });
    }
    return Promise.resolve(false);
  };

  return StartModule;
});
