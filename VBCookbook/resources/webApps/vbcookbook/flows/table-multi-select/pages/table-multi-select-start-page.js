/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define(['knockout', 'ojs/ojkeyset'], function (ko, keySet) {
  "use strict";

  var PageModule = function PageModule() {
    this.selectedRows = ko.observable(new keySet.KeySetImpl());
  };


  PageModule.prototype.selectedChangedListener = function (selected) {
    var selectionText = '';

    if (selected.row.isAddAll()) {
      var iterator = selected.row.deletedValues();
      iterator.forEach(function (key) {
        selectionText = selectionText.length === 0 ? key :
          selectionText + ', ' + key;
      });

      if (iterator.size > 0) {
        selectionText = ' except row key(s): ' + selectionText;
      }
      selectionText = 'All rows are selected' +
        selectionText;
    } else {
      if (selected.row.values().size > 0) {
        selected.row.values().forEach(function (key) {
          selectionText += (selectionText.length === 0 ? key :
            ', ' + key);
        });
        selectionText = 'Selected row key(s): ' + selectionText;
      }

    }
    return selectionText;
  };

  PageModule.prototype.getSelectedRows = function() {
    return this.selectedRows;
  };

  PageModule.prototype.deselectAll = function () {
    this.selectedRows(new keySet.KeySetImpl());
  };

  PageModule.prototype.selectSpecificRows = function () {
    this.selectedRows(new keySet.KeySetImpl([1,3]));// row with dept no. 1 and 3
  };

  PageModule.prototype.isSelectionEmpty = function (selection) {
    var row = selection.row;
    if (row.isAddAll()) {
      return false;
    } else {
      return row.values().size === 0;  
    }
  };

  PageModule.prototype.getRowsForIDs = function (table, rowIDs) {
    var index = 0;
    var result = [];
    // search only in first 1000 rows:
    while (index < 1000) {
      var row = table.getDataForVisibleRow(index);
      if (row === null) {
        return result;
      }
      const match = rowIDs.indexOf(row.data.id);
      if (match > -1) {
        rowIDs.splice(match, 1);
        result.push(row.data);
        if (rowIDs.length === 0) {
          return result;
        }
      }
      index++;
    }
    return result;
  };

  return PageModule;
});