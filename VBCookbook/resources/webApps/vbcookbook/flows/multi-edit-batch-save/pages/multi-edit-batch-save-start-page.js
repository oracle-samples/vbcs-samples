/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([], function() {
  'use strict';

  var PageModule = function PageModule() {

    PageModule.prototype.existsInArray = function(id, employeeArray) {
      var record = employeeArray.find(e => e.id === id);

      if (record == undefined) {
        return false;
      }

      return true;
    }

    PageModule.prototype.isNewRow = function(id, rowStatus) {
      var status = rowStatus[id];

      if (status == undefined) // employee record exists in employeearray but not in rowStatus
      {
        return false; // so this is not a new row, its an existing row
      }

      if (status == 'inserted') // thats a new row, not existing in db
      {
        return true;
      }

      return false;
    }

    PageModule.prototype.prepareDepartmentBatchPayload = function(
      newdepname, originaldepname, depid) {
      var payload = [];

      if (newdepname != originaldepname) {
        payload.push(PageModule.generateBatchSnippet("/Department/" +
          depid, {
            "departmentName": newdepname
          }, 'update', "dep" + depid));
      }

      return payload;
    }

    PageModule.prototype.prepareEmployeesBatchPayload = function(
      employeeArray, rowStatus, payload) {
      Object.keys(rowStatus).forEach(key => {

        key = parseInt(key); // the field is actually numeral

        var change = rowStatus[key];
        var record = employeeArray.find(e1 => e1.id === key);

        if (change == 'inserted') {
          record.hireDate = new Date(); // mandatory field
          record.job = 1; // mandatory field
          payload.push(PageModule.generateBatchSnippet("/Employee/",
            record, 'create', key));
        } else if (change == 'modified') {
          payload.push(PageModule.generateBatchSnippet("/Employee/" +
            key, record, 'update', key));
        } else if (change == 'deleted') {
          payload.push(PageModule.generateBatchSnippet("/Employee/" +
            key, {}, 'delete', key));
        }
      });

      if (payload.length > 0) {
        return {
          parts: payload
        };
      }

      return undefined;
    }

    PageModule.generateBatchSnippet = function(url, payload, operation,
      id) {
      return {
        id: "part" + id,
        path: url,
        operation: operation,
        payload: payload ? payload : {}
      };
    };

  };

  return PageModule;
});
