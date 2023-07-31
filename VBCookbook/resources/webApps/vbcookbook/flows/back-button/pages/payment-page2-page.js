/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([], () => {
  'use strict';
      let self = {};

  class PageModule {
    userResponse(response) {
      let dialog = document.getElementById('confirmDialog');
      if (dialog.isOpen()) {
        dialog.close();
      }
      if (self.userInputComplete) {
        self.userInputComplete(response);
        delete self.userInputComplete;
      }
    }

    checkWithUser() {
      // let self = this;
      let checkPromise = new Promise(function (resolve) {
        self.userInputComplete = resolve;
        document.getElementById('confirmDialog').open();
      });
      return checkPromise;
    }
  }

  return PageModule;
});
