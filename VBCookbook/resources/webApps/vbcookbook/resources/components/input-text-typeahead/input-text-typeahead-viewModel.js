/**
 * Copyright (c)2020, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
/**
  Copyright (c) 2019, 2023 Oracle and/or its affiliates.
  The Universal Permissive License (UPL), Version 1.0
*/
'use strict';
define(['knockout', 'ojs/ojinputtext'], function (ko) {

  function InputTypeaheadComponentModel(context) {

    let self = this;
    self.composite = context.element;
    self.properties = context.properties;
    // subIds
    self.valueInputElementId = "input-typeahead" + context.uniqueId;
    self.internalRawValue = ko.observable();
    self._setupLimiter(self.properties.typeaheadWait);
  }

  InputTypeaheadComponentModel.prototype.bindingsApplied = function (context) {
    let self = this;
    self.valueInputElement = document.getElementById(self.valueInputElementId);
  };

  InputTypeaheadComponentModel.prototype._setupLimiter = function (timeout) {
    let self = this;
    if (self.rawWatcher) {
      self.rawWatcher.dispose();
    }
    self.typeaheadValue = ko.pureComputed(self.internalRawValue).extend({ rateLimit: { method: 'notifyWhenChangesStop', timeout: timeout } });
    self.rawWatcher = self.typeaheadValue.subscribe(function (newValue) { self.properties.setProperty('rawValue', newValue); });
  };

  InputTypeaheadComponentModel.prototype.validate = function () {
    let self = this;
    return self.valueInputElement.validate();
  };

  InputTypeaheadComponentModel.prototype.propertyChanged = function (context) {
    let self = this;
    if (context.updatedFrom === 'external') {
      switch (context.property) {
        case 'readonly':
          //When we switch to readonly any bad input in the field is discarded and we revert back to a valid value
          if (context.value) {
            self.properties.setProperty('valid', 'valid');
          }
          break;
        case 'typeaheadWait':
          self._setupLimiter(context.value);
          break;
      }
    }
  };

  return InputTypeaheadComponentModel;
});
