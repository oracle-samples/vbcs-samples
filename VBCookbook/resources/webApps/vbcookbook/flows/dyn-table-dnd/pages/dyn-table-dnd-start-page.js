/**
 * Copyright (c)2020, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([], () => {
  'use strict';

  class PageModule {

    constructor(ctx) {
      this.eventHelper = ctx.getEventHelper();
      this.handleDropRows = this.handleDropRows.bind(this);
    }

    handleDropRows(event, ui) {
      let dragData = event.dataTransfer.getData("application/ojtablerows+json");

      if (dragData) {
        this.eventHelper.fireCustomEvent("dataDropped", {
          rows: JSON.parse(dragData).map((i) => i.data),
          startIndex: ui.rowIndex,
        });
      }
    }

  }
  
  return PageModule;
});
