/**
 * Copyright (c)2020, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define(['ojs/ojknockouttemplateutils', 'ojs/ojcollectiondatagriddatasource', 'ojs/ojmodel', 'ojs/ojconverter-datetime', 'ojs/ojconverter-number'], function (KnockoutTemplateUtils, collectionModule, Model, DateTimeConverter, NumberConverter) {
  'use strict';

  var PageModule = function PageModule() {
    var dateOptions = { formatType: 'date', dateFormat: 'medium' };
    this.dateConverter = new DateTimeConverter.IntlDateTimeConverter(dateOptions);
    var salaryOptions =
    {
      style: 'currency',
      currency: 'USD',
      currencyDisplay: 'symbol'
    };
    this.salaryConverter = new NumberConverter.IntlNumberConverter(
      salaryOptions);
  };
  PageModule.prototype.getDataSource = function (employeeData) {
    var collection = new Model.Collection(employeeData.items);
    return new collectionModule.CollectionDataGridDataSource(collection,
      { rowHeader: 'id' }
    );
  };

  PageModule.prototype.getRenderer = function (tmpl) {
    return KnockoutTemplateUtils.getRenderer(tmpl);
  };
  PageModule.prototype.formatDate = function (data) {
    return this.dateConverter.format(data);
  };
  PageModule.prototype.formatNumber = function (data) {
    return this.salaryConverter.format(data);
  };

  PageModule.prototype.getCellClassName = function (cellContext) {
    var key = cellContext.keys.column;
    if (key === 'salary') {
      return 'oj-helper-justify-content-right';
    } else if (key === 'firstName' ||
      key === 'lastName' ||
      key === 'email' ||
      key === 'hireDate' || key === 'departmentObject') {
      return 'oj-sm-justify-content-flex-start';
    }
    return '';
  };

  return PageModule;
});
