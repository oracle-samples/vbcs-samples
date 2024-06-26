/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([], function () {
  "use strict";

  class PageModule {
    constructor(ctx) {
      this.eventHelper = ctx.getEventHelper();
      this.handleDropRows = this.handleDropRows.bind(this);
    }

    /**
     *
     * @param {type} event
     * @param {type} ui
     * @return {undefined}
     */
    handleDropRows(event, ui) {
      let dragData = event.dataTransfer.getData("application/ojtablerows+json");

      if (dragData) {
        this.eventHelper.fireCustomEvent("dataDropped", {
          rows: JSON.parse(dragData).map((i) => i.data),
          startIndex: ui.rowIndex,
        });
      }
    }

    /**
     *
     * @param {Array} data
     * @param {Array} rows
     * @param {Number} startIndex
     *
     * @return {Array}
     */
    addRows(data, rows, startIndex) {
      return data
        .slice(0, startIndex)
        .concat(rows)
        .concat(data.slice(startIndex));
    }
  }

  return PageModule;
});
