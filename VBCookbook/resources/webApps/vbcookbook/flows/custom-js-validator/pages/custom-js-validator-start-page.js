/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([], function (oj) {
  'use strict';

  var PageModule = function PageModule() {
  };

  PageModule.prototype.validateText = function () {
    return [{
      validate: (value) => {
        if (value == null || String(value) == "") {
          throw new Error("This is a mandatory field.");
        }

        var pattern = new RegExp(/[a-zA-Z0-9]+$/);
        var validValue = pattern.test(value);

        if (!validValue) {
          throw new Error("Please enter alphabets and numbers only.");
        }
      },
      getHint: () => {
        return "Special characters are not allowed";
      }
    }];
  };

  PageModule.prototype.validateDate = function (futureDate) {    
    return [{
      validate: (value) => {
        if (value == null || String(value) == "") {
          throw new Error("This is a mandatory field.");
        }
        var options =
        {
          year: 'numeric',
          month: 'numeric',
          day: 'numeric'
        };
        var futureDateString = futureDate.toLocaleDateString("en-US", options);
        var enterredDate = new Date(value);
        if (enterredDate <= futureDate) {
          throw new Error("Entered date must be after " + futureDateString + ".");
        }
      }
    }];
  };

  PageModule.prototype.validateForm = function (arg1) {
    document.getElementById("text1").validate();
    document.getElementById("date1").validate();

    var tracker = document.getElementById("tracker");

    if (tracker.valid === "valid") {
      return true;
    }
    else {
      tracker.showMessages();
      tracker.focusOn("@firstInvalidShown");
      return false;
    }
  };

  PageModule.prototype.getFutureDate = function () {
    var today = new Date();
    today.setDate(today.getDate() + 7); // 7 days ahead of today
    return today;
  };

  return PageModule;
});
