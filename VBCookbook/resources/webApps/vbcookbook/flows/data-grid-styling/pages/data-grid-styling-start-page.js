/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define(["ojs/ojrowdatagridprovider", "ojs/ojarraydataprovider", "text!datagrid/customer-data.json", "ojs/ojconverter-datetime", "ojs/ojconverter-number", "ojs/ojdatagridprovider", "ojs/ojdatagrid"],
  function (RowDataGridProvider, ArrayDataProvider, jsonData, ojconverter_datetime, ojconverter_number) {
    'use strict';

    var PageModule = function PageModule() {
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
        "Eye Color"
      ];
      
      this.jsonData = JSON.parse(jsonData);
      this.adp = new ArrayDataProvider(this.jsonData);
      this.numericFields = [2, 3, 4, 5, 8];
      this.columnHeaderStyle = (headerContext) => {
        const columnKey = headerContext.index;
        if (columnKey === 8) {
          return "width:175px";
        }
        else if (columnKey === 4) {
          return "width:150px";
        }
        else if (columnKey === 9) {
          return "width:220px;";
        }
        else if (columnKey === 11 || columnKey === 13) {
          return "width:100px;";
        }
        return "width:125px;";
      };
      this.getColumnHeaderClassName = (headerContext) => {
        return this.getAlignmentClassNameByIndex(headerContext.index, null);
      };
      this.getCellClassName = (cellContext) => {
        return this.getAlignmentClassNameByIndex(cellContext.indexes.column, cellContext.indexes.row);
      };
      this.getAlignmentClassNameByIndex = (colIndex, rowIndex) => {
        let styleClass = "";
        if (this.numericFields.includes(colIndex)) {
          styleClass += "oj-helper-justify-content-right";
        }
        else if (colIndex === 13) {
          styleClass += "oj-helper-justify-content-center";
        }
        else {
          styleClass += "oj-sm-justify-content-flex-start";
        }
        if (rowIndex && (rowIndex + 1) % 5 === 0) {
          styleClass += " oj-typography-bold oj-bg-neutral-30";
        }
        return styleClass;
      };
      this.dateConverter = new ojconverter_datetime.IntlDateTimeConverter({
        formatType: "date",
        dateFormat: "medium",
      });
      this.numberConverter = new ojconverter_number.IntlNumberConverter({
        style: "currency",
        currency: "USD",
        currencyDisplay: "symbol",
      });
      this.formatDate = (dateString) => {
        const trimmedDate = dateString.substring(0, dateString.length - 7);
        return new Date(trimmedDate).toISOString();
      };
    };

    PageModule.prototype.getDatagridData = function () {
      let dataGridProvider = new RowDataGridProvider.RowDataGridProvider(this.adp,
      {
        columns: {
          rowHeader: ['index']
        },
        columnHeaders: {
          column: this.colHeaders
        }
      });
      return dataGridProvider;
    };

    PageModule.prototype.numberConverter = function () {
      return this.numberConverter;
    };
    PageModule.prototype.dateConverter = function () {
      return this.dateConverter;
    };
    PageModule.prototype.getCellClassName = function () {
      return this.getCellClassName;
    };
    PageModule.prototype.columnHeaderStyle = function () {
      return this.columnHeaderStyle;
    };
    PageModule.prototype.getColumnHeaderClassName = function () {
      return this.getColumnHeaderClassName;
    };

    return PageModule;
  });
