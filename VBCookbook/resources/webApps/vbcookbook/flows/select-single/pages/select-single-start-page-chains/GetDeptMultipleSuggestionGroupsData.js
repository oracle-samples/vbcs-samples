/**
 * Copyright (c)2020, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([
  'vb/action/actionChain',
  'vb/action/actions',
  'vb/action/actionUtils',
  'ojs/ojarraytreedataprovider'
], (
  ActionChain,
  Actions,
  ActionUtils,
  ArrayTreeDataProvider
) => {
  'use strict';

  class GetDeptMultipleSuggestionGroupsData extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application } = context;

      const response = await Actions.callRest(context, {
        endpoint: 'businessObjects/getall_Department',
      });

      if (response.ok) {
        let itemsForSingleSelect = response.body.items;
        itemsForSingleSelect.forEach(obj => { obj.value = obj.id; obj.label = obj.departmentName; });

        $page.variables.groupingDept =
          [
            {
              "children": [
                {
                  "value": response.body.items[0].id,
                  "label": response.body.items[0].departmentName
                }
              ],
              "label": "Commonly Selected",
              "value": 234567
            },
            {
              "children": itemsForSingleSelect,
              "label": "All Departments",
              "value": 1234567
            }
          ];

          let departmentTreeData = new ArrayTreeDataProvider($page.variables.groupingDept, {
          keyAttributes: "value",
        });

        $page.variables.departmentTDP = departmentTreeData;
      } else {
        await Actions.fireNotificationEvent(context, {
          summary: response.message.summary
        });
      }
    }
  }

  return GetDeptMultipleSuggestionGroupsData;
});
