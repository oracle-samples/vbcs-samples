/**
 * Copyright (c)2020, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([], function () {
  "use strict";

  const menu = {
    "all": { label: "All Recipes" },
    Components: { label: "Components" },
    REST: { label: "REST" },
    Dynamic: { label: "Dynamic Components" },
    PWA: { label: "PWA" },
    Application: { label: "Application" },
    "Components|Table": { label: "Table" },
    "Components|List View": { label: "List View" },
    "Components|Data Grid": {label: "Data Grid" },
    "Components|List of Values - LOV": { label: "List of Values" },
    "Components|Chart": { label: "Chart" },
    "Components|Checkbox Set": { label: "Checkbox Set" },
    "Components|Editable Rows": { label: "Editable Rows" },
    "Navigation": { label: "Navigation" },
    "Dynamic|Table": { label: "Dynamic Table"},
    "Dynamic|Form": { label: "Dynamic Form"},
    "Dynamic|Other": { label: "Dynamic Other"},

  };

  class PageModule {
    constructor(ctx) {
      this.eventHelper = ctx.getEventHelper();
    }

    getMenuItemLabel(selectedValue) {
      return menu[selectedValue] !== undefined ? menu[selectedValue].label : "All Recipes";
    }

    onRawValueListener(event) {
      const self = this;
      if (self.lastTimeout !== undefined) {
        clearTimeout(self.lastTimeout);
      }
      self.lastTimeout = setTimeout(() => {
        self.eventHelper.fireCustomEvent("updateSearchTerm", {
          searchTerm: event.detail.value,
        });
      }, 333);
    }
  }

  return PageModule;
});
