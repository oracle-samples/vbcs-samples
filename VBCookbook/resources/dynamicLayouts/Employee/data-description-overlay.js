/**
 * Copyright (c)2020, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([], function () {
  'use strict';

  let DataDescriptionModule = function DataDescriptionModule() { };

  DataDescriptionModule.prototype.calculateEmployeeExperience = function (value) {
    if (value !== null) {
      let hireDate = new Date(value);
      let currentDate = new Date();
      let expInYears = currentDate.getUTCFullYear() - hireDate.getUTCFullYear();
      let hireMonth = hireDate.getMonth();
      let currentMonth = currentDate.getMonth();
      let expInMonths = 0;
      if (hireMonth > currentMonth) {
        let diffInMonths = hireMonth - currentMonth;
        expInMonths = 12 - diffInMonths;
        expInYears = expInYears - 1;
      } else {
        expInMonths = currentMonth - hireMonth;
      }
      let totalExperience = expInYears + ' years ' + expInMonths + ' months ';
      return totalExperience;
    }
    return null;
  };
  
  return DataDescriptionModule;
});
