/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([], function () {
  "use strict";

  // save the event helper to raise the custom event later
  class PageModule {
    constructor(context) {
      this.eventHelper = context.getEventHelper();
      this.promiseResolver = {};
    }

    // refresh-content function to use in HTML
    getRefreshFunction() {
      return this.checkForUpdates.bind(this);
    }

    // the function to raise a custom event and return a promise
    checkForUpdates() {
      let myPromise = new Promise(function (resolve, reject) {
        this.promiseResolver.resolveHandler = resolve;
      });

      // raise a check for refresh event and refresh the data set
      // from the action chain associated with the event
      this.eventHelper.fireCustomEvent("customRefreshContentsEvent");

      return myPromise;
    }

    // the function to call to resolve the promise after data refresh
    concludeRefresher() {
      // data refreshed, resolve the promise now
      // timeout is a dummy delay so the refresh does on
      // complete immediately
      setTimeout(() => {
        this.promiseResolver.resolveHandler();
      }, 2000);
    }
  }

  return PageModule;
});
