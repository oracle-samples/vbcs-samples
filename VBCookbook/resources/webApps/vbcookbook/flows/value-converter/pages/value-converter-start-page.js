/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define(["ojs/ojconverter-datetime", "ojs/ojconverter-number"], function (
  datetimeConverter,
  numberConverter
) {
  class PageModule {
    constructor() {}

    formatDateWithDefaultConverter(date) {
      let defaultDateConverter = new datetimeConverter.IntlDateTimeConverter({
        formatType: "date",
      });
      return defaultDateConverter.format(date);
    }

    formatDateWithFullConverter(date) {
      // more details of the converter
      // https://www.oracle.com/webfolder/technetwork/jet/jsdocs/oj.IntlDateTimeConverter.html#ConverterOptions
      let dateConverter = new datetimeConverter.IntlDateTimeConverter({
        formatType: "date",
        dateFormat: "full",
      });
      return dateConverter.format(date);
    }

    formatDatetimeWithFullConverter(date) {
      let dateConverter = new datetimeConverter.IntlDateTimeConverter({
        formatType: "datetime",
        dateFormat: "full",
        timeFormat: "full",
      });
      return dateConverter.format(date);
    }

    formatTimeWithFullConverter(date) {
      let dateConverter = new datetimeConverter.IntlDateTimeConverter({
        formatType: "time",
        timeFormat: "full",
      });
      return dateConverter.format(date);
    }

    formatCurrencyWithUSDConverter(number) {
      let currencyConverter = new numberConverter.IntlNumberConverter({
        style: "currency",
        currency: "USD",
        currencyDisplay: "code",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return currencyConverter.format(number);
    }

    formatNumeralWithDecimalConverter(number) {
      let decimalConverter = new numberConverter.IntlNumberConverter({
        style: "decimal",
        minimumFractionDigits: 3,
        maximumFractionDigits: 3,
      });
      return decimalConverter.format(number);
    }
  }

  return PageModule;
});
