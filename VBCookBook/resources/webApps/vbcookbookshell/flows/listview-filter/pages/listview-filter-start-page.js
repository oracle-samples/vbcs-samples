/**
 * Copyright (c) 2018, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
/* global oj */
define(['ojs/ojvalidation-datetime', 'ojs/ojvalidation-number'],
function() {
  'use strict';
  var PageModule = function PageModule() {
    var converterFactory = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_NUMBER);
    var currencyOptions = {
      style: "currency",
      currency: "USD",
      currencyDisplay:"symbol"
    };
    this.currencyConverter = converterFactory.createConverter(currencyOptions);

    var dateConverterFactory = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME);
    var dateOptions = {
      pattern: "yyyy-MM-dd"
    };
    this.dateConverter = dateConverterFactory.createConverter(dateOptions);
  };

  PageModule.prototype.getDateConverter = function () {
    return this.dateConverter;
  };

  PageModule.prototype.getCurrencyConverter = function () {
    return this.currencyConverter;
  };

  PageModule.prototype.filterDisplayTexts = {
    "prices": "Price is ",
    "authors": "Author is ",
    "ratings": "Customer Rating is ",
    "lt30": "(lesser than $30)",
    "30to40": "(between $30 and $39.99)",
    "40to50": "(between $40 and $49.99)",
    "gte50": "($50 or more)",
    "dcoward": "'Danny Coward'",
    "hschildt": "'Herbert Schildt'",
    "jmanico": "'Jim Manico'",
    "jbrock": "'John Brock'",
    "mnaftalin": "'Maurice Naftalin'",
    "five": "5",
    "four": "(greater than 4 and lesser than 5)",
    "three": "(greater than 3 and lesser than 4)",
    "two": "(lesser than 3)"
  };

  PageModule.prototype.filterObjects = {

    "lt30": {
      "attribute": "price",
      "op": "$lt",
      "value": 30
    },
    "30to40": {
      "op": "$and",
      "criteria": [
        {
          "attribute": "price",
          "op": "$ge",
          "value": 30
        },
        {
          "attribute": "price",
          "op": "$lt",
          "value": 40
        }
      ]
    },
    "40to50": {
      "op": "$and",
      "criteria": [
        {
          "attribute": "price",
          "op": "$ge",
          "value": 40
        },
        {
          "attribute": "price",
          "op": "$lt",
          "value": 50
        }
      ]
    },
    "gte50": {
      "attribute": "price",
      "op": "$ge",
      "value": 50
    },

    "dcoward": {
      "attribute": "author",
      "op": "$co",
      "value": "Danny Coward"
    },
    "hschildt": {
      "attribute": "author",
      "op": "$co",
      "value": "Herbert Schildt"
    },
    "jmanico": {
      "attribute": "author",
      "op": "$co",
      "value": "Jim Manico"
    },
    "jbrock": {
      "attribute": "author",
      "op": "$co",
      "value": "John Brock"
    },
    "mnaftalin": {
      "attribute": "author",
      "op": "$co",
      "value": "Maurice Naftalin"
    },

    "five":{
      "attribute": "rating",
      "op": "$eq",
      "value": 5
    },
    "four": {
      "op": "$and",
      "criteria": [
        {
          "attribute": "rating",
          "op": "$ge",
          "value": 4
        },
        {
          "attribute": "rating",
          "op": "$lt",
          "value": 5
        }
      ]
    },
    "three": {
      "op": "$and",
      "criteria": [
        {
          "attribute": "rating",
          "op": "$ge",
          "value": 3
        },
        {
          "attribute": "rating",
          "op": "$lt",
          "value": 4
        }
      ]
    },
    "two": {
      "attribute": "rating",
      "op": "$lt",
      "value": 3
    }
  };

  /**
   * @param {Object} filterSelections
   * @returns {Object}
   * @description Prepares filter query for the selected filter criteria.
   */
  PageModule.prototype.prepareFilterCriteria = function (filterSelections) {

    var filterCriterion = {
      "op": "$and",
      "criteria": []
    };
    var outerCriteriaList = [], categoryWiseDisplayTexts = [];

    Object.keys(filterSelections).forEach((function(key) {
      var criteriaForCategory = this.prepareCriteriaForCategory(key, filterSelections[key]);
      if(criteriaForCategory != null) {
        outerCriteriaList.push(criteriaForCategory.filterCriteria);
        categoryWiseDisplayTexts.push(criteriaForCategory.filterString);
      }
    }).bind(this));

    if(outerCriteriaList.length == 1) {
      return {
        fCriteria: outerCriteriaList[0],
        filterDisplay: categoryWiseDisplayTexts[0]
      };
    } else if(outerCriteriaList.length > 1) {
      filterCriterion.criteria = outerCriteriaList;
      return {
        fCriteria: filterCriterion,
        filterDisplay: "[ "+categoryWiseDisplayTexts.join(" ] AND [ ") + " ] "
      };

    } else {
      return {
        fCriteria: {},
        filterDisplay: ""
      };
    }
  };

  /**
   * @param {String} key
   * @param {Array} selections
   * @returns {Object}
   * @description Prepares filter query for the categories within the criteria.
   */
  PageModule.prototype.prepareCriteriaForCategory = function(key, selections) {
    var displayString='', criteria;

    if(selections.length == 0) {
      return null;
    }
    if(selections.length == 1) {
      criteria = this.filterObjects[selections[0]];
    } else if(selections.length > 1) {
      var orCriteria = {
        "op" : "$or",
        "criteria": []
      };
      selections.forEach((function(selectedOption) {
        orCriteria.criteria.push(this.filterObjects[selectedOption]);
      }).bind(this));
      criteria = orCriteria;
    }

    var displayTexts = [];
    var startText = this.filterDisplayTexts[key];
    selections.forEach((function(selectedOption) {
      displayTexts.push(this.filterDisplayTexts[selectedOption]);
    }).bind(this));
    displayString = startText + " " + displayTexts.join(" OR ");
    return {
      filterCriteria: criteria,
      filterString: displayString
    };
  };

  return PageModule;
});
