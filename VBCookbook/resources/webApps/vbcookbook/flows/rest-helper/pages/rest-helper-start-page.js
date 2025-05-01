/**
 * Copyright (c)2020, 2025, Oracle and/or its affiliates.
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
  }

  return PageModule;
});
