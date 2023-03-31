/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([], function () {
  'use strict';

  // save the event helper to raise the custom event later
  var PageModule = function PageModule(context) {
    this.eventHelper = context.getEventHelper();
  };

  // refresh-content function to use in HTML
  PageModule.prototype.getRefreshFunction = function () {
    return this.checkForUpdates.bind(this);
  };

  var promiseResolver = {};

  // the function to raise a custom event and return a promise
  PageModule.prototype.checkForUpdates = function () {
    let myPromise = new Promise(function (resolve, reject) {
      promiseResolver.resolveHandler = resolve;
    });

    // raise a check for refresh event and refresh the data set 
    // from the action chain associated with the event
    this.eventHelper.fireCustomEvent("customRefreshContentsEvent");

    return myPromise;
  };

  // the function to call to resolve the promise after data refresh
  PageModule.prototype.concludeRefresher = function () {
    // data refreshed, resolve the promise now
    // timeout is a dummy delay so the refresh does on 
    // complete immediately
    setTimeout(() => { promiseResolver.resolveHandler(); }, 2000);
  };

  return PageModule;
});
