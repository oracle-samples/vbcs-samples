/**
 * Copyright (c)2020, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([], function() {
  'use strict';

  var PageModule = function PageModule() {};

  /**
   * Get array of data to render recipe tiles on home screen.
   */
  PageModule.prototype.getRecipeListData = function(_metadata) {
    if (this.recipeArray === undefined) {
      this.recipeArray = this._flattenGalleryList(this
        ._getGalleryPageData(_metadata.navigationMenu, _metadata.demos));
    }
    return this.recipeArray;
  };

  /**
   * Flatten the hierarchy into a list
   */
  PageModule.prototype._flattenGalleryList = function(galleryList) {
    var sortedArray = [];
    for (var i = 0; i < galleryList.length; i++) {
      if (galleryList[i].items !== undefined) {
        for (var j = 0; j < galleryList[i].items.length; j++) {
          sortedArray.push(Object.assign({
            categoryName: galleryList[i].label
          }, galleryList[i].items[j]));
        }
      }
    }
    return sortedArray;
  };

  /**
   * Extract category tiles from metadata
   */
  PageModule.prototype._getGalleryPageData = function(menu, demos, parent) {
    var galleryData = [];
    for (var i = 0; i < menu.length; i++) {
      var menuItem = {};
      var origMenuItem = menu[i];
      if (origMenuItem.id === 'add-new-demo') {
        // skip template recipe
        continue;
      }
      if (typeof origMenuItem === "object") {
        menuItem = {
          "id": 'g_' + origMenuItem.id,
          "label": origMenuItem.label,
          "categoryBannerClass": "categorygrouplabel " + origMenuItem
            .categoryBannerClass,
          "categoryBorderClass": parent ? parent.categoryBorderClass :
            ""
        };
        if (origMenuItem.items && origMenuItem.items.length > 0 &&
          typeof origMenuItem
          .items[0] === "string") {
          menuItem["icon"] = origMenuItem.icon;
          menuItem["url"] = origMenuItem.items[0];
        }
      }

      if (origMenuItem.items && origMenuItem.items.length > 0 &&
        typeof origMenuItem
        .items[0] === "object")
        menuItem["items"] = this._getGalleryPageData(origMenuItem.items,
          demos, origMenuItem);

      galleryData.push(menuItem);
    }
    return galleryData;
  };

  return PageModule;
});