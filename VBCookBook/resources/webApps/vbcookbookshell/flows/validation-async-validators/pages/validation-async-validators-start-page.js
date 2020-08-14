/**
 * Copyright (c) 2018, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define(['ojs/ojcore', 'ojs/ojvalidation-number'], function(oj) {
    'use strict';

    var PageModule = function PageModule() {};
    
    PageModule.prototype.getAsyncValidator = function() {
      return this.asyncValidator;
    };
 
    // Our demo asyncValidator. It uses a NumberRangeValidator based on
    // some knowledge gathered from the server-side, which we pretend
    //  to go to, and we use a setTimeout to mock a delay.
    PageModule.prototype.asyncValidator = [{
      // 'validate' is a required method
      // that is a function that returns a Promise
      'validate': function(value) {
        // used to format the value
        // in the validation error message.
        var converterOption = {
          type: "number",
          options: {
            style: "currency",
            currency: "USD",
            currencyDisplay: "code",
            pattern: "¤ ##,##0.00"
          }
        };

        // In our demo validator, We could use different numberRange
        // validators based on credit score.
        // Here we will create only one for simplicity
        var validatorHigh = oj.Validation.validatorFactory("numberrange")
          .createValidator({
            max: 10000,
            converter: converterOption
          });

        return new Promise(function(resolve, reject) {
          // We could go to the server and check the
          // user's credit score and based on that
          // credit score use a specific number range validator.
          // We mock a server-side delay
          setTimeout(function() {
            try {
              validatorHigh.validate(value);
              resolve(true);
            } catch (e) {
              var converterInstance =
                oj.IntlConverterUtils.
              getConverterInstance(converterOption);
              reject(new Error(e.message +
                ' Your value is ' +
                converterInstance.format(value) + '.'));
            }
          }, 1000);
        });
      },
      // 'hint' is an optional field that returns a Promise
      'hint': new Promise(function(resolve, reject) {
        // mock server-side delay to get the hint
        var maxPurchase;
        var converterOption;
        var converterInstance;
        var formattedMaxPurchase;

        setTimeout(function() {
          maxPurchase = 10000;
          converterOption = {
            type: "number",
            options: {
              style: "currency",
              currency: "USD",
              currencyDisplay: "code",
              pattern: "¤ ##,##0.00"
            }
          };

          converterInstance =
            oj.IntlConverterUtils
            .getConverterInstance(converterOption);
          formattedMaxPurchase = converterInstance.format(
            maxPurchase);
          resolve('Your maximum allowed is ' +
            formattedMaxPurchase + '.');
        }, 100);
      })
    }];

    return PageModule;
  });
