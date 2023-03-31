/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define(['ojs/ojarraytreedataprovider', 'ojs/ojarraydataprovider'], function (ArrayTreeDataProvider, ArrayDataProvider) {
  'use strict';

  class PageModule {

    constructor(ctx) {
      this.eventHelper = ctx.getEventHelper();
    }

    wait(ms) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    };

    getCategorySmartFilter(category) {
      if (category === "PWA") {
        return [
            {
              "value": "PWA",
              "label": "PWA",
              "filterLabel": "Category",
              "filter": "CategoryLOV"
            }
          ];
      } else if (category === "Application") {
        return [
            {
              "value": "Application",
              "label": "Application",
              "filterLabel": "Category",
              "filter": "CategoryLOV"
            }
          ];
      } else if (category === "Components") {
        return [
            {
              "value": "Components",
              "label": "Components",
              "filterLabel": "Category",
              "filter": "CategoryLOV"
            }
          ];
      } else if (category === "Dynamic") {
        return [
            {
              "value": "Dynamic",
              "label": "Dynamic UI",
              "filterLabel": "Category",
              "filter": "CategoryLOV"
            }
          ];
      } else if (category === "REST") {
        return [
            {
              "value": "REST",
              "label": "REST",
              "filterLabel": "Category",
              "filter": "CategoryLOV"
            }
          ];
      }
    }

    scrollRight() {
      var found;
      var rightEnd = document.getElementById("downloaded-heading").getBoundingClientRect().right;
      var width = document.getElementById("downloaded-heading").getBoundingClientRect().width-300;
      [...Array(12).keys()].forEach(ind => {
        var e = document.getElementById("tile-"+ind);
        var tileEnd = e.getBoundingClientRect().left+300;
        if (tileEnd > rightEnd+width) {
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
      var found;
      var leftStart = document.getElementById("downloaded-heading").getBoundingClientRect().left;
      var width = document.getElementById("downloaded-heading").getBoundingClientRect().width-300;
      [...Array(12).keys()].forEach(ind => {
        var e = document.getElementById("tile-"+ind);
        var tileStart = e.getBoundingClientRect().left;
        if (tileStart < leftStart-width) {
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


    /**
     *
     * @param {String} arg1
     * @return {String}
     */
    showSearchResultsBitLater() {
      setTimeout(() => {this.eventHelper.fireCustomEvent('ShowSearchResultsBitLater')}, 33);
    }
  }

  
  return PageModule;
});
