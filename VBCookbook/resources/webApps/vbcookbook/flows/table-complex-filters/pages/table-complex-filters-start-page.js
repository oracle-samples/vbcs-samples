/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define(["ojs/ojoffcanvas", "ojs/ojconverter-number"], function (
  OffcanvasUtils,
  NumberConverter
) {
  "use strict";

  class PageModule {
    constructor() {
      this.inrNumberConverter = new NumberConverter.IntlNumberConverter({
        options: {
          style: "currency",
          currency: "INR",
        },
        type: "number",
      });
    }
    
    formatCurrency(data) {
      return this.inrNumberConverter.format(data);
    }

    toggle() {
      const options = {
        selector: "#filterDrawer",
        content: "#mainContent",
        modality: "modeless",
        displayMode: "push",
        autoDismiss: "none",
      };
      return OffcanvasUtils.toggle(options);
    }

    mapToCriteria(filters) {
      let criteria = [];
      filters
        .filter((f) => {
          if (Array.isArray(f.value) && f.value.length > 0) {
            return true;
          } else if (typeof f.value === "string" && f.value) {
            return true;
          } else if (typeof f.value === "number" && f.value !== null) {
            return true;
          } else {
            return false;
          }
        })
        .forEach((f) => {
          if (Array.isArray(f.value)) {
            let arrayCriteria = [];
            f.value.forEach((val) => {
              arrayCriteria.push({
                op: "$eq",
                attribute: f.attribute,
                value: val,
              });
            });
            criteria.push({
              op: "$or",
              criteria: arrayCriteria,
            });
          } else if (f.value) {
            criteria.push(f);
          }
        });
      return criteria;
    }
  }

  return PageModule;
});
