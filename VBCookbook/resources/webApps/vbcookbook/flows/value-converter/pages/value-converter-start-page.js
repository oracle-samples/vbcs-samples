/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define(["ojs/ojconverter-datetime", "ojs/ojconverter-number"], function (datetimeConverter, numberConverter) {

  var PageModule = function PageModule() { };

  PageModule.prototype.formatDateWithDefaultConverter = function (date) {
    let defaultDateConverter = new datetimeConverter.IntlDateTimeConverter({
      formatType: "date"
    });
    return defaultDateConverter.format(date);
  }

  PageModule.prototype.formatDateWithFullConverter = function (date) {
    // more details of the converter
    // https://www.oracle.com/webfolder/technetwork/jet/jsdocs/oj.IntlDateTimeConverter.html#ConverterOptions
    let dateConverter = new datetimeConverter.IntlDateTimeConverter({
      formatType: "date", dateFormat: 'full'
    });
    return dateConverter.format(date);
  }

  PageModule.prototype.formatDatetimeWithFullConverter = function (date) {
    let dateConverter = new datetimeConverter.IntlDateTimeConverter({
      formatType: "datetime", dateFormat: 'full', timeFormat: 'full'
    });
    return dateConverter.format(date);
  }

  PageModule.prototype.formatTimeWithFullConverter = function (date) {
    let dateConverter = new datetimeConverter.IntlDateTimeConverter({
      formatType: "time", timeFormat: 'full'
    });
    return dateConverter.format(date);
  }

  PageModule.prototype.formatCurrencyWithUSDConverter = function (number) {
    let currencyConverter = new numberConverter.IntlNumberConverter({
      style: "currency", currency: "USD", currencyDisplay: "code", minimumFractionDigits: 2, maximumFractionDigits: 2
    });
    return currencyConverter.format(number);
  }

  PageModule.prototype.formatNumeralWithDecimalConverter = function (number) {
    let decimalConverter = new numberConverter.IntlNumberConverter({
      style: "decimal", minimumFractionDigits: 3, maximumFractionDigits: 3
    });
    return decimalConverter.format(number);
  }

  return PageModule;
});