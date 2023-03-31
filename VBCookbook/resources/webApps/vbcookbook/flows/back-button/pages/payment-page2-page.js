/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([], () => {
  'use strict';
      var self = {};

  class PageModule {
    userResponse(response) {
      var dialog = document.getElementById('confirmDialog');
      if (dialog.isOpen()) {
        dialog.close();
      }
      if (self.userInputComplete) {
        self.userInputComplete(response);
        delete self.userInputComplete;
      }
    }

    checkWithUser() {
      // var self = this;
      var checkPromise = new Promise(function (resolve) {
        self.userInputComplete = resolve;
        document.getElementById('confirmDialog').open();
      });
      return checkPromise;
    }
  }

  return PageModule;
});
