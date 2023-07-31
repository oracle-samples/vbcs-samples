/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define(["knockout", "ojs/ojkeyset"], function (ko, keySet) {
  "use strict";

  class PageModule {
    constructor() {
      this.selectedRows = ko.observable(new keySet.KeySetImpl());
    }

    selectedChangedListener(selected) {
      let selectionText = "";

      if (selected.row.isAddAll()) {
        let iterator = selected.row.deletedValues();
        iterator.forEach(function (key) {
          selectionText =
            selectionText.length === 0 ? key : selectionText + ", " + key;
        });

        if (iterator.size > 0) {
          selectionText = " except row key(s): " + selectionText;
        }
        selectionText = "All rows are selected" + selectionText;
      } else {
        if (selected.row.values().size > 0) {
          selected.row.values().forEach(function (key) {
            selectionText += selectionText.length === 0 ? key : ", " + key;
          });
          selectionText = "Selected row key(s): " + selectionText;
        }
      }
      return selectionText;
    }

    getSelectedRows() {
      return this.selectedRows;
    }

    deselectAll() {
      this.selectedRows(new keySet.KeySetImpl());
    }

    selectSpecificRows() {
      this.selectedRows(new keySet.KeySetImpl([1, 3])); // row with dept no. 1 and 3
    }

    isSelectionEmpty(selection) {
      let row = selection.row;
      if (row.isAddAll()) {
        return false;
      } else {
        return row.values().size === 0;
      }
    }

    getRowsForIDs(table, rowIDs) {
      let index = 0;
      let result = [];
      // search only in first 1000 rows:
      while (index < 1000) {
        let row = table.getDataForVisibleRow(index);
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
    }
  }

  return PageModule;
});
