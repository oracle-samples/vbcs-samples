/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define(['ojs/ojoffcanvas', 'ojs/ojconverter-number'], function(OffcanvasUtils,
  NumberConverter) {
  'use strict';

  var PageModule = function PageModule() {
    this.inrNumberConverter =
      new NumberConverter.IntlNumberConverter({
        "options": {
          "style": "currency",
          "currency": "INR"
        },
        "type": "number"
      });
  };
  PageModule.prototype.formatCurrency = function(data) {
    return this.inrNumberConverter.format(data);
  }

  PageModule.prototype.toggle = function() {
    const options = {
      selector: '#filterDrawer',
      content: '#mainContent',
      modality: 'modeless',
      displayMode: 'push',
      autoDismiss: 'none'
    }
    return OffcanvasUtils.toggle(options)
  }

  PageModule.prototype.mapToCriteria = function(filters) {
    var criteria = [];
    filters.filter(f => {
      if (Array.isArray(f.value) && f.value.length > 0) {
        return true;
      } else if (typeof f.value === 'string' && f.value) {
        return true;
      } else if (typeof f.value === 'number' && f.value !== null) {
        return true;
      } else {
        return false;
      }
    }).forEach(f => {
      if (Array.isArray(f.value)) {
        var arrayCriteria = [];
        f.value.forEach(val => {
          arrayCriteria.push({
            op: '$eq',
            attribute: f.attribute,
            value: val
          })
        })
        criteria.push({
          op: '$or',
          criteria: arrayCriteria
        })
      } else if (f.value) {
        criteria.push(f)
      }
    })
    return criteria;
  }

  return PageModule;
});
