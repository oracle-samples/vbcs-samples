/**
 * Copyright (c)2020, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
  define(['knockout', 'ojs/ojkeyset'], function(ko, keySet) {
    "use strict";

    var PageModule = function PageModule() {};


    PageModule.prototype.selectedChangedListener = function(selected) {

      var selectionText = '';

      if (selected.row.isAddAll()) {
        var iterator = selected.row.deletedValues();
        iterator.forEach(function(key) {
          selectionText = selectionText.length === 0 ? key :
            selectionText + ', ' + key;
        });

        if (iterator.size > 0) {
          selectionText = ' except ' + selectionText;
        }
        selectionText = 'Row Selection:\nAll rows are selected' +
          selectionText;
      } else {
        if (selected.row.values().size > 0) {
          selected.row.values().forEach(function(key) {
            selectionText += (selectionText.length === 0 ? key :
              ', ' + key);
          });
          selectionText = 'Row Selection:\nRow Keys: ' + selectionText;
        }

      }
      return selectionText;
    };

    PageModule.prototype.selectedItems = ko.observable({
      row: new keySet.KeySetImpl(),
      column: new keySet.KeySetImpl()
    });
    return PageModule;
  });