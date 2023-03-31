/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([], function() {
  'use strict';

  var PageModule = function PageModule() {};

  PageModule.prototype.getSampleCsvPath = function() {
    return require.toUrl('resources/csv/employees.csv');
  };
  /**
   *
   * @param {File} files
   * @return {String}
   */
  PageModule.prototype.readAndProcess = function(files) {
    return new Promise(resolve => {
      try {
        const file = files[0];
        let fileContent = []
        const fileReader = new FileReader();

        fileReader.readAsText(file);

        fileReader.onload = (e) => {
          let result = e.target.result;
          let columns = [];
          let size;
          if (result) {
            result = result.split('\n').map(i => i.split(','))
            console.log(result)
            columns = result[0].map(col => ({
              field: col,
              headerText: col.replace(/([A-Z]+)/g, " $1")
                .charAt(0).toUpperCase() + col.replace(
                  /([A-Z]+)/g, " $1").slice(1)
            }))
            size = columns.length;
            let tableData = (result.slice(1) || []).filter(r => r
              .length === size).map((r,
              idx) => {
              const part = {};
              for (let colIdx = 0; colIdx < columns
                .length; colIdx++) {
                part[columns[colIdx].field] = r[
                  colIdx];
              }
              return part;
            })
            resolve({
              success: true,
              result: {
                name: file.name,
                size: file.size,
                type: file.type,
                columns: columns,
                tableData: tableData
              },
              error: {
                detail: ''
              }
            })
          } else {
            resolve({
              success: false,

              error: {
                detail: 'Empty File : ' + result
              }
            })
          }
        }
      } catch (err) {
        resolve({
          success: false,
          error: {
            detail: 'Error while reading file : ' + err.detail
          }
        })
      }
    })
  };

  /**
   *
   * @param {String} arg1
   * @return {String}
   */
  PageModule.prototype.preparePayload = function(data, boPath, boOp) {
    return {
      parts: data.map((r, idx) => {
        return {
          id: `part-${idx}`,
          operation: boOp,
          path: boPath,
          payload: r
        }
      })
    }
  };

  return PageModule;
});