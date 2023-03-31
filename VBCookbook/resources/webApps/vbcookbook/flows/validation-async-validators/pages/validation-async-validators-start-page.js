/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define(['ojs/ojcore', 'ojs/ojvalidation-number'], function (oj) {
  'use strict';

  var PageModule = function PageModule() { };

  PageModule.prototype.getAsyncValidator = function () {
    return this.asyncValidator;
  };

  // Our demo asyncValidator. It uses a NumberRangeValidator based on
  // some knowledge gathered from the server-side, which we pretend
  //  to go to, and we use a setTimeout to mock a delay.
  PageModule.prototype.asyncValidator = [{
    // 'validate' is a required method
    // that is a function that returns a Promise
    'validate': function (value) {
      // used to format the value
      // in the validation error message.
      var converterOption = {
        type: "number"
      };

      // In our demo validator, We could use different numberRange
      // validators based on credit score.
      // Here we will create only one for simplicity
      var validator = oj.Validation.validatorFactory("numberrange")
        .createValidator({
          min: 100, max: 10000, options: converterOption
        });

      return new Promise(function (resolve, reject) {
        // We could go to the server and check the
        // user's credit score and based on that
        // credit score use a specific number range validator.
        // We mock a server-side delay
        setTimeout(function () {
          try {
            validator.validate(value);
            resolve(true);
          } catch (e) {
            reject(new Error(e.message + ' Your value is ' + value + '.'));
          }
        }, 2000);
      });
    },
    // 'hint' is an optional field that returns a Promise
    'hint': new Promise(function (resolve, reject) {
      // mock server-side delay to get the hint      
      setTimeout(function () {
        const maxPurchase = 10000;
        const minPurchase = 100;

        resolve("Enter a number between " +
          minPurchase +
          " and " +
          maxPurchase +
          " , otherwise you will see an error.");
      }, 2000);
    })
  }];

  PageModule.prototype.validateGroup = function (arg1) {
    var tracker = document.getElementById("tracker");
    if (tracker.valid === "valid") {
    }
    else if (tracker.valid.startsWith("invalid")) {
      if (tracker.valid === "invalidHidden") {
        tracker.showMessages();
      }
      tracker.focusOn("@firstInvalidShown");
    }
    return tracker.valid;
  };

  PageModule.prototype.waitTillPending = function () {
    // make the button action wait till the
    // field validation gets over ie tracker 
    // status changes to something other than 'pending'
    return new Promise(function (resolve, reject) {
      var tracker = document.getElementById("tracker");
      var waitForValidation = function () {        
        if (tracker.valid === "pending") {
          // simulated field validation at server still going on
          setTimeout(function () {
            return waitForValidation();
          }, 200);
        }
        else {
          resolve(true);
        }
      };
      waitForValidation();
    });
  };

  return PageModule;
});
