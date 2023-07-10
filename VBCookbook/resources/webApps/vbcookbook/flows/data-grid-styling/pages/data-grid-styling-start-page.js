/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([
  "ojs/ojrowdatagridprovider",
  "ojs/ojarraydataprovider",
  "text!datagrid/customer-data.json",
  "ojs/ojconverter-datetime",
  "ojs/ojconverter-number",
  "ojs/ojdatagridprovider",
  "ojs/ojdatagrid",
], function (
  RowDataGridProvider,
  ArrayDataProvider,
  jsonData,
  ojconverter_datetime,
  ojconverter_number
) {
  "use strict";

  class PageModule {
    constructor() {
      this.colHeaders = [
        "First Name",
        "Last Name",
        "Balance",
        "Registered",
        "Total Amount Ordered",
        "Last Order",
        "Company",
        "Short Name",
        "Phone",
        "Country origin",
        "Gender",
        "Age",
        "Birth Date",
        "Active",
        "Eye Color",
      ];

      this.jsonData = JSON.parse(jsonData);
      this.adp = new ArrayDataProvider(this.jsonData);
      this.numericFields = [2, 3, 4, 5, 8];

      this.dateConverter = new ojconverter_datetime.IntlDateTimeConverter({
        formatType: "date",
        dateFormat: "medium",
      });
      this.numberConverter = new ojconverter_number.IntlNumberConverter({
        style: "currency",
        currency: "USD",
        currencyDisplay: "symbol",
      });
    }

    columnHeaderStyle(headerContext) {
      const columnKey = headerContext.index;
      if (columnKey === 8) {
        return "width:175px";
      } else if (columnKey === 4) {
        return "width:150px";
      } else if (columnKey === 9) {
        return "width:220px;";
      } else if (columnKey === 11 || columnKey === 13) {
        return "width:100px;";
      }
      return "width:125px;";
    }

    getColumnHeaderClassName(headerContext) {
      return this.getAlignmentClassNameByIndex(headerContext.index, null);
    }

    getCellClassName(cellContext) {
      return this.getAlignmentClassNameByIndex(
        cellContext.indexes.column,
        cellContext.indexes.row
      );
    }

    getAlignmentClassNameByIndex(colIndex, rowIndex) {
      let styleClass = "";
      if (this.numericFields.includes(colIndex)) {
        styleClass += "oj-helper-justify-content-right";
      } else if (colIndex === 13) {
        styleClass += "oj-helper-justify-content-center";
      } else {
        styleClass += "oj-sm-justify-content-flex-start";
      }
      if (rowIndex && (rowIndex + 1) % 5 === 0) {
        styleClass += " oj-typography-bold oj-bg-neutral-30";
      }
      return styleClass;
    }

    formatDate(dateString) {
      const trimmedDate = dateString.substring(0, dateString.length - 7);
      return new Date(trimmedDate).toISOString();
    }

    getDatagridData() {
      let dataGridProvider = new RowDataGridProvider.RowDataGridProvider(
        this.adp,
        {
          columns: {
            rowHeader: ["index"],
          },
          columnHeaders: {
            column: this.colHeaders,
          },
        }
      );
      return dataGridProvider;
    }

    numberConverter() {
      return this.numberConverter;
    }

    dateConverter() {
      return this.dateConverter;
    }
  }

  return PageModule;
});
