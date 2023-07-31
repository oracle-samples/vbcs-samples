/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([], function () {
  "use strict";

  class PageModule {
    constructor() {}

    existsInArray(id, employeeArray) {
      let record = employeeArray.find((e) => e.id === id);

      if (record === undefined) {
        return false;
      }

      return true;
    }

    isNewRow(id, rowStatus) {
      let status = rowStatus[id];

      if (status === undefined) {
        // employee record exists in employeearray but not in rowStatus
        return false; // so this is not a new row, its an existing row
      }

      if (status === "inserted") {
        // thats a new row, not existing in db
        return true;
      }

      return false;
    }

    prepareDepartmentBatchPayload(newdepname, originaldepname, depid) {
      let payload = [];

      if (newdepname !== originaldepname) {
        payload.push(
          this.generateBatchSnippet(
            "/Department/" + depid,
            {
              departmentName: newdepname,
            },
            "update",
            "dep" + depid
          )
        );
      }

      return payload;
    }

    prepareEmployeesBatchPayload(employeeArray, rowStatus, payload) {
      Object.keys(rowStatus).forEach((keyParam) => {
        let key = parseInt(keyParam,10); // the field is actually numeral

        let change = rowStatus[key];
        let record = employeeArray.find((e1) => e1.id === key);

        if (change === "inserted") {
          record.hireDate = new Date(); // mandatory field
          record.job = 1; // mandatory field
          payload.push(
            this.generateBatchSnippet("/Employee/", record, "create", key)
          );
        } else if (change === "modified") {
          payload.push(
            this.generateBatchSnippet(
              "/Employee/" + key,
              record,
              "update",
              key
            )
          );
        } else if (change === "deleted") {
          payload.push(
            this.generateBatchSnippet(
              "/Employee/" + key,
              {},
              "delete",
              key
            )
          );
        }
      });

      if (payload.length > 0) {
        return {
          parts: payload,
        };
      }

      return undefined;
    }

    generateBatchSnippet(url, payload, operation, id) {
      return {
        id: "part" + id,
        path: url,
        operation: operation,
        payload: payload ? payload : {},
      };
    }
  }

  return PageModule;
});
