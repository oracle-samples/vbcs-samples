/**
 * Copyright (c)2020, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define(["ojs/ojconverter-datetime"], function (
  datetimeConverter
){
  'use strict';

  class LayoutModule {

    getTrainingsValue(fields) {
      let trainingArray = [];
      if (fields.safetyTraining() === "Yes") {
        trainingArray.push("safety");
      }
      if (fields.ethicalTraining() === "Yes") {
        trainingArray.push("ethical");
      }
      if (fields.securityTraining() === "Yes") {
        trainingArray.push("security");
      }
      return trainingArray;
    }

    storeTrainingsChanges(event, fields) {
      const value = event.detail.value;
      let v = value.includes("safety") ? "Yes" : "No";
      if (v !== fields.safetyTraining) {
        fields.safetyTraining( v );
      }
      v = value.includes("ethical") ? "Yes" : "No";
      if (v !== fields.ethicalTraining) {
        fields.ethicalTraining( v );
      }
      v = value.includes("security") ? "Yes" : "No";
      if (v !== fields.securityTraining) {
        fields.securityTraining( v );
      }
    }

    formatDateWithFullConverter(date) {
      let dateConverter = new datetimeConverter.IntlDateTimeConverter({
        formatType: "date",
        dateFormat: "full",
      });
      return dateConverter.format(date);
    }

    createItemTextFunction(fieldNames){
       return function(itemContext) {
          let ret = "";
          for (let i = 0; i < fieldNames.length; i++) {
            if (typeof fieldNames[i] === 'string') {
              if (i !== 0) {
                ret += ' : ';
              }
              ret += `${itemContext.data[fieldNames[i]]}`;
            } else if (typeof fieldNames[i] === 'object') {
              let ct = 0;
              for (let key in fieldNames[i]) {
                if (i !== 0 || ct !== 0) {
                  if (fieldNames[i][key].hasOwnProperty('separator')) {
                    ret += fieldNames[i][key].separator;
                  } else {
                    ret += ' : ';
                  }
                }
                ret += `${itemContext.data[key]}`;
                ct++;
              }
            }
          }
          return ret;
       };
    }
  }

  return LayoutModule;
});
