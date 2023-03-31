/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([], () => {
  'use strict';

  class FragmentModule {

    getImagePerCategory(recipe) {
      if (recipe.subCategory === 'Table') {
        return "table.png";
      } else if (recipe.subCategory === 'Data Grid') {
        return "datagrid.png";
      } else if (recipe.subCategory === 'Chart') {
        return "chart.png";
      } else if (recipe.subCategory === 'List View') {
        return "list.png";
      } else if (recipe.subCategory === 'List of Values - LOV') {
        return "lov.png";
      } else if (recipe.subCategory === 'Navigation') {
        return "tree.png";
      } else if (recipe.subCategory === 'Editable Rows') {
        return "editable-rows.png";
      } else if (recipe.subCategory === 'Redwood Template') {
        return "redwood.png";
      } else if (recipe.category === 'REST') {
        return "rest.png";
      } else if (recipe.category === 'PWA') {
        return "pwa.png";
      } else if (recipe.category === 'Dynamic') {
        return "dynamic.png";
      } else {
        return "app.png";
      }
    }
  }
  
  return FragmentModule;
});
