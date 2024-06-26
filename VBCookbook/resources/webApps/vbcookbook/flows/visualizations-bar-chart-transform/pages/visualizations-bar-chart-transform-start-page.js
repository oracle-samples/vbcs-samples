/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([], function () {
  "use strict";

  class PageModule {
    constructor() {}

    aggregateData(flattenedArray) {
      let groupByJobMap = new Map();

      flattenedArray.forEach(function (employeeRecord) {
        // employeeRecord is the emp record with fields series (job), group (job), value (sal)
        if (groupByJobMap.has(employeeRecord.series)) {
          // aggregated data object with fields series (job), group (job), value (totalsalary) and count
          let aggregateDataObject = groupByJobMap.get(employeeRecord.series);
          aggregateDataObject.value =
            aggregateDataObject.value + employeeRecord.value; // total salary for given job
          aggregateDataObject.count = aggregateDataObject.count + 1; // count of employees
          groupByJobMap.set(employeeRecord.series, aggregateDataObject);
        } else {
          employeeRecord.count = 1; // initialize count=1
          groupByJobMap.set(employeeRecord.series, employeeRecord);
        }
      });

      let array = Array.from(groupByJobMap, ([jobKey, jobRecord]) => ({
        group: jobRecord.group,
        series: jobRecord.series + " (" + jobRecord.count + " Employees)",
        value: jobRecord.value,
      }));

      return array;
    }
  }

  return PageModule;
});
