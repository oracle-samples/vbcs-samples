/**
 * Copyright (c)2020, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([], function () {
  'use strict';

  var PageModule = function PageModule() { };

  /**
   * Get array of data to render recipe tiles on home screen.
   */
  PageModule.prototype.getRecipeListData = function (_metadata) {
    if (this.recipeArray === undefined) {
      this.recipeArray = [];
      this._getGalleryPageData(_metadata.navigationMenu, ""); // recipeArray gets populated here
    }
    return this.recipeArray;
  };

  /**
   * Extract category tiles from metadata
   */
  PageModule.prototype._getGalleryPageData = function (menu, parentLabel) {
    for (var i = 0; i < menu.length; i++) {
      var origMenuItem = menu[i];
      if (origMenuItem.items && origMenuItem.items.length > 0) {
        if (origMenuItem.items[0].items === undefined) { // this is last level / actual recipe
          var menuItem = {};
          menuItem = {
            "id": 'g_' + origMenuItem.id,
            "label": origMenuItem.label,
            "url": origMenuItem.items[0],
            "icon": origMenuItem.icon
          }

          this.recipeArray.push(Object.assign({
            categoryName: parentLabel
          }, menuItem));
        } else {
          this._getGalleryPageData(origMenuItem.items, origMenuItem.label);
        }
      }
    }
  };

  return PageModule;
});