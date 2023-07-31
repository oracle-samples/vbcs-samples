/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([], function () {
  "use strict";

  const menu = {
    all: { label: "All Recipes", value: "all" },

    Components: { label: "Components", value: "Components" },
    REST: { label: "REST", value: "REST" },
    Dynamic: { label: "Dynamic", value: "Dynamic" },
    PWA: { label: "PWA", value: "PWA" },
    Application: { label: "Application", value: "Application" },

    Table: { label: "Table", value: "Table", icon: "tables-basic" },
    "List View": { label: "List View", value: "List View", icon: "list" },
    "Data Grid": {
      label: "Data Grid",
      value: "Data Grid",
      icon: "grid-view-small",
    },
    "List of Values - LOV": {
      label: "List of Values",
      value: "List of Values - LOV",
      icon: "text-input-combo",
    },
    Chart: { label: "Chart", value: "Chart", icon: "chart" },
    "Checkbox Set": {
      label: "Checkbox Set",
      value: "Checkbox Set",
      icon: "checkbox-set",
    },
    "Editable Rows": {
      label: "Editable Rows",
      value: "Editable Rows",
      icon: "tables-basic",
    },
    Navigation: {
      label: "Navigation",
      value: "Navigation",
      icon: "film-strip",
    },
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

    getCategorySmartFilter(category) {
      if (category === "PWA") {
        return [
          {
            value: "PWA",
            label: "PWA",
            filterLabel: "Category",
            filter: "CategoryLOV",
          },
        ];
      } else if (category === "Application") {
        return [
          {
            value: "Application",
            label: "Application",
            filterLabel: "Category",
            filter: "CategoryLOV",
          },
        ];
      } else if (category === "Components") {
        return [
          {
            value: "Components",
            label: "Components",
            filterLabel: "Category",
            filter: "CategoryLOV",
          },
        ];
      } else if (category === "Dynamic") {
        return [
          {
            value: "Dynamic",
            label: "Dynamic UI",
            filterLabel: "Category",
            filter: "CategoryLOV",
          },
        ];
      } else if (category === "REST") {
        return [
          {
            value: "REST",
            label: "REST",
            filterLabel: "Category",
            filter: "CategoryLOV",
          },
        ];
      }
    }

    scrollRight() {
      let found;
      let rightEnd = document
        .getElementById("downloaded-heading")
        .getBoundingClientRect().right;
      let width =
        document.getElementById("downloaded-heading").getBoundingClientRect()
          .width - 300;
      [...Array(12).keys()].forEach((ind) => {
        let e = document.getElementById("tile-" + ind);
        let tileEnd = e.getBoundingClientRect().left + 300;
        if (tileEnd > rightEnd + width) {
          if (found === undefined) {
            found = e;
          }
        }
      });
      if (found === undefined) {
        found = document.getElementById("tile-11");
      }
      if (found) {
        found.scrollIntoView();
      }
    }

    scrollLeft() {
      let found;
      let leftStart = document
        .getElementById("downloaded-heading")
        .getBoundingClientRect().left;
      let width =
        document.getElementById("downloaded-heading").getBoundingClientRect()
          .width - 300;
      [...Array(12).keys()].forEach((ind) => {
        let e = document.getElementById("tile-" + ind);
        let tileStart = e.getBoundingClientRect().left;
        if (tileStart < leftStart - width) {
          found = e;
        }
      });
      if (found === undefined) {
        found = document.getElementById("tile-0");
      }
      if (found) {
        found.scrollIntoView();
      }
    }
  }

  return PageModule;
});
