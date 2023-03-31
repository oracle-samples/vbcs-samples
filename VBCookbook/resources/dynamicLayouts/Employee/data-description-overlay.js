/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([], function () {
  'use strict';

  var DataDescriptionModule = function DataDescriptionModule() { };

  DataDescriptionModule.prototype.calculateEmployeeExperience = function (value) {
    if (value != null) {
      let hireDate = new Date(value);
      let currentDate = new Date();
      var expInYears = currentDate.getUTCFullYear() - hireDate.getUTCFullYear();
      var hireMonth = hireDate.getMonth();
      var currentMonth = currentDate.getMonth();
      var expInMonths = 0;
      if (hireMonth > currentMonth) {
        var diffInMonths = hireMonth - currentMonth;
        expInMonths = 12 - diffInMonths;
        expInYears = expInYears - 1;
      }
      else {
        expInMonths = currentMonth - hireMonth;
      }
      var totalExperience = expInYears + ' years ' + expInMonths + ' months ';
      return totalExperience;
    }
    return null;
  };

  return DataDescriptionModule;
});
