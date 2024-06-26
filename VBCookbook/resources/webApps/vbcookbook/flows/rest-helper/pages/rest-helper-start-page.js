/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define(["vb/helpers/rest", "ojs/ojasyncvalidator-regexp"], function (
  Rest,
  AsyncRegExpValidator
) {
  "use strict";

  class PageModule {
    constructor() {}

    regexpEmailValidator() {
      return new AsyncRegExpValidator({
        pattern:
          "([a-zA-Z0-9_\\-\\.]+)@([a-zA-Z0-9_\\-\\.]+)\\.([a-zA-Z]{2,5})",
        hint: "Enter an email address.",
        messageDetail: "Value must be of the form xxx@xxx.xx",
      });
    }

    uniqueEmailValidator() {
      return {
        hint: Promise.resolve("Provide a unique email to the Employee"),
        validate: (value) => new Promise((resolve, reject) => {
            Rest.get("businessObjects/getall_Employee")
              .parameters({
                q: `email = '${value}'`,
              })
              .fetch()
              .then((res) => {
                if (res.body.items.length > 0) {
                  reject({
                    detail:
                      "Duplicate entry found for Employee " +
                      res.body.items[0].firstName,
                  });
                } else {
                  resolve();
                }
              });
          }),
      };
    }

    /**
     *
     * @param {String} arg1
     * @return {String}
     */
    isFormValid(arg1) {
      let el = document.getElementById("tracker");
      if (el.valid === "valid") {
        return true;
      } else {
        el.showMessages();
        el.focusOn("@firstInvalidShown");
        return false;
      }
    }

    waitTillPending() {
      // make the button action wait till the
      // field validation gets over ie tracker
      // status changes to something other than 'pending'
      return new Promise(function (resolve, reject) {
        let tracker = document.getElementById("tracker");
        let waitForValidation = function () {
          if (tracker.valid === "pending") {
            // simulated field validation at server still going on
            setTimeout(function () {
              return waitForValidation();
            }, 200);
          } else {
            resolve(true);
          }
        };
        waitForValidation();
      });
    }
  }

  return PageModule;
});
