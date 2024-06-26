/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define(["datagrid/DemoDataGridProvider"], function (DemoDataGridProvider) {
  "use strict";

  let gridCols = [
    { headerText: "Jan", field: "bonus01" },
    { headerText: "Feb", field: "bonus02" },
    { headerText: "Mar", field: "bonus03" },
    { headerText: "Apr", field: "bonus04" },
    { headerText: "May", field: "bonus05" },
    { headerText: "Jun", field: "bonus06" },
    { headerText: "Jul", field: "bonus07" },
    { headerText: "Aug", field: "bonus08" },
    { headerText: "Sep", field: "bonus09" },
    { headerText: "Oct", field: "bonus10" },
    { headerText: "Nov", field: "bonus11" },
    { headerText: "Dec", field: "bonus12" },
  ];

  let rowStartHeaders = [
    {
      headerText: "Department",
      field: "departmentObject.items[0].departmentName",
    },
    { headerText: "Job", field: "jobObject.items[0].jobTitle" },
    { headerText: "First Name", field: "firstName" },
  ];

  let colEndHeaderLabel = [
    { headerText: "Total Monthly Bonus", field: "totalMonthlyBonus" },
  ];

  let rowEndHeaderLabel = [
    { headerText: "Yearly Bonus", field: "yearlyBonus" },
  ];

  class PageModule {
    constructor() {}

    getColumnStartHeaderLabels() {
      const colHeaders = gridCols.map((i) => i.headerText);
      return colHeaders;
    }

    getRowStartHeaderLabels() {
      const colHeaders = rowStartHeaders.map((i) => i.headerText);
      return colHeaders;
    }

    getColumnEndHeaderValues(dataArray) {
      let colSum = [];
      for (let i = 0; i < dataArray.length; i++) {
        for (let j = 0; j < dataArray[i].length; j++) {
          colSum[j] = (colSum[j] || 0) + dataArray[i][j];
        }
      }
      const colEndHeaders = colSum;
      return colEndHeaders;
    }

    getRowEndHeaderValues(dataArray) {
      let rowSum = [];
      for (let i = 0; i < dataArray.length; i++) {
        for (let j = 0; j < gridCols.length; j++) {
          rowSum[i] = (rowSum[i] || 0) + dataArray[i][j];
        }
      }
      const rowEndHeaders = rowSum;
      return rowEndHeaders;
    }

    getRowEndHeaderLabels() {
      const rowHeaderLabel = rowEndHeaderLabel.map((i) => i.headerText);
      return rowHeaderLabel;
    }
    getColumnEndHeaderLabels() {
      const colHeaderLabel = colEndHeaderLabel.map((i) => i.headerText);
      return colHeaderLabel;
    }

    getValue(item, fieldParam) {
      let field = fieldParam;
      if (field.indexOf(".") > 0 || field.indexOf("[") > 0) {
        field = field.replaceAll("[", ".");
        field = field.replaceAll("]", ".");
        field = field.replaceAll("..", ".");
        if (field.endsWith(".")) {
          field = field.substr(0, field.length - 1);
        }
        let res = item;
        field.split(".").forEach((key) => (res = res[key]));
        return res;
      } else {
        return item[field] !== undefined ? item[field] : Math.floor(Math.random() * 25) * 100;
      }
    }

    buildBodyArray(items, cols) {
      const bodyArray = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        let flattendArray = [];
        cols.forEach((col_) => flattendArray.push(this.getValue(item, col_.field)));
        bodyArray.push(flattendArray);
      }
      return bodyArray;
    }

    getDatagridData(items) {
      let dataValues = this.buildBodyArray(items, gridCols);
      let length = dataValues.length;
      let rowStartHeaderValues = this.buildBodyArray(items, rowStartHeaders);
      this.dataGridProvider = new DemoDataGridProvider(
        dataValues,
        { row: length, column: gridCols.length },
        rowStartHeaderValues,
        this.getColumnStartHeaderLabels(),
        this.getRowStartHeaderLabels(),
        this.getColumnEndHeaderLabels(),
        this.getColumnEndHeaderValues(dataValues),
        this.getRowEndHeaderLabels(),
        this.getRowEndHeaderValues(dataValues)
      );
      return this.dataGridProvider;
    }

    rowHeaderStyle(headerContext) {
      if (headerContext.level === 0) {
        // if Department column
        return "width:110px;font-size:12px;";
      } else if (headerContext.level === 1) {
        // if Job column
        return "width:170px;font-size:12px;";
      } else if (headerContext.level === 2) {
        // if FirstName column
        return "width:100px;font-size:12px;";
      }
      return "width:85px;";
    }
  }

  return PageModule;
});
