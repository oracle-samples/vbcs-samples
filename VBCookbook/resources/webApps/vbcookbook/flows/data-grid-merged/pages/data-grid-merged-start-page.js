/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define(["datagrid/DemoDataGridProvider"],
  function (DemoDataGridProvider) {
    'use strict';

    var cols = [
      { "headerText": "Department", "field": "departmentObject.items[0].departmentName" },
      { "headerText": "Job", "field": "jobObject.items[0].jobTitle" },
      { "headerText": "First Name", "field": "firstName" },
      { "headerText": "Last Name", "field": "lastName" },
      { "headerText": "Email", "field": "email" },
      { "headerText": "Phone", "field": "phoneNumber" }
    ];

    var PageModule = function PageModule() {

      this.getColHeaders = () => {
        const colHeaders = cols.map(i => i.headerText);
        return colHeaders;
      };

      this.getRowHeaders = (items) => {
        const rowHeaders = [];
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          rowHeaders.push([item.id]);
        }
        return rowHeaders;
      };

      var getValue = function (item, field) {
        if (field.indexOf('.') > 0 || field.indexOf('[') > 0) {
          field = field.replaceAll('[', '.');
          field = field.replaceAll(']', '.');
          field = field.replaceAll('..', '.');
          if (field.endsWith('.')) {
            field = field.substr(0, field.length - 1);
          }
          var res = item;
          field.split('.').forEach(key => res = res[key]);
          return res;
        } else {
          return item[field] !== undefined ? item[field] : Math.floor(Math.random() * 25) * 100;
        }
      };

      this.buildBodyArray = (items, cols) => {
        const bodyArray = [];
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          var flattendArray = [];
          cols.forEach(col_ => flattendArray.push(getValue(item, col_.field)));
          bodyArray.push(flattendArray);
        }
        return bodyArray;
      };

      this.mergeFunction = (value1, value2) => {
        //  debugger;
        if (typeof value1 === 'object' && 'departmentName' in value1) {
          value1 = value1.departmentName;
        }
        if (typeof value2 === 'object' && 'departmentName' in value2) {
          value2 = value2.departmentName;
        }
        if (typeof value1 === 'object' && 'jobTitle' in value1) {
          value1 = value1.jobTitle;
        }
        if (typeof value2 === 'object' && 'jobTitle' in value2) {
          value2 = value2.jobTitle;
        }
        return value1 == value2;
      };

      this.columnHeaderStyle = (headerContext) => {
        const columnKey = headerContext.index;
        if (columnKey === 1) {
          return "width:270px";
        }
        else if (columnKey === 2 || columnKey === 3 || columnKey === 5) {
          return "width:160px";
        }
        else if (columnKey === 4 || columnKey === 0) {
          return "width:200px";
        }
      };
    };

    PageModule.prototype.getDatagridData = function (items) {
      let dataValues = this.buildBodyArray(items, cols);
      let length = dataValues.length;
      let rowStartHeaderValues = this.getRowHeaders(items);
      this.dataGridProvider = new DemoDataGridProvider(
        dataValues,
        { row: length, column: cols.length },
        rowStartHeaderValues,
        this.getColHeaders()
      );
      return this.dataGridProvider;
    };

    PageModule.prototype.columnHeaderStyle = function () {
      return this.columnHeaderStyle;
    };

    return PageModule;
  });
