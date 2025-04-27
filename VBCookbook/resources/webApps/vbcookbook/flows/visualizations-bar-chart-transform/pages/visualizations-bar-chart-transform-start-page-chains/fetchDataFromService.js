/**
 * Copyright (c)2020, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([
  'vb/action/actionChain',
  'vb/action/actions',
  'vb/action/actionUtils',
], (
  ActionChain,
  Actions,
  ActionUtils
) => {
  'use strict';

  class fetchDataFromService extends ActionChain {

    /**
     * @param {Object} context
     * @param {Object} params
     */
    async run(context) {
      const { $page, $flow, $application, $chain } = context;

      const response = await Actions.callRest(context, {
        endpoint: 'ords/getEmployees',
        uriParams: {
          limit: 1000
        }
      });

      if (!response.ok) {
        await Actions.fireNotificationEvent(context, {
          summary: response.message.summary,
          message: 'Rest Call Failed',
          displayMode: 'transient',
        });
      } else {

        // create group, series, value based items for chart
        let flattenedArray = [];
        response.body.items.forEach(function (employeeRecord) {
          let chartItem = {};
          chartItem.group = employeeRecord.job;
          chartItem.series = employeeRecord.job;
          chartItem.value = employeeRecord.sal;
          flattenedArray.push(chartItem);
        });

        // create aggregate data items for chart
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

        let aggregatedData = Array.from(groupByJobMap, ([jobKey, jobRecord]) => ({
          group: jobRecord.group,
          series: jobRecord.series + " (" + jobRecord.count + " Employees)",
          value: jobRecord.value,
        }));

        $page.variables.transformedDataADP.data = aggregatedData;

      }
    }
  }

  return fetchDataFromService;
});
