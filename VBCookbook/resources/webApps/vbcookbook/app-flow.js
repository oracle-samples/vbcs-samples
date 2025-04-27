/**
 * Copyright (c)2020, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([
  "text!resources/config/vb-metadata.json",
  "ojs/ojarraydataprovider",
  "ojs/ojresponsiveknockoututils",
  "ojs/ojresponsiveutils",
  
  "oj-sp/spectra-shell/config/config",
  "text!mockrest/businessObjects/objects/Country/entity-data.csv",
  "text!mockrest/businessObjects/objects/Department/entity-data.csv",
  "text!mockrest/businessObjects/objects/Employee/entity-data.csv",
  "text!mockrest/businessObjects/objects/EmployeeSkill/entity-data.csv",
  "text!mockrest/businessObjects/objects/Job/entity-data.csv",
  "text!mockrest/businessObjects/objects/JobHistory/entity-data.csv",
  "text!mockrest/businessObjects/objects/Location/entity-data.csv",
  "text!mockrest/businessObjects/objects/Region/entity-data.csv",
  "text!mockrest/businessObjects/objects/Skill/entity-data.csv",
  "text!mockrest/fa/objects/activities/entity-data.csv",
  "text!mockrest/fa/objects/Attachments/entity-data.csv",
], function (
  newMetadata,
  ArrayDataProvider,
  ResponsiveKnockoutUtils,
  ResponsiveUtils,
  
) {
  "use strict";

  const searchables = ["label", "id", "desc", "category", "subCategory"];
  const categories = ["Components", "REST", "Dynamic", "PWA", "Application"];
  const subCategories = [
    "Table",
    "List View",
    "Data Grid",
    "List of Values - LOV",
    "Chart",
    "Checkbox Set",
    "Editable Rows",
    "Navigation",
    "Form",
    "Other",
  ];

  class AppModule {
    constructor() {
      // by default disable offline toolkit:
      // this.forceOffline();

      this.metadata = JSON.parse(newMetadata);
      this.recipes = {};
      this.categories = {};
      this.metadata.forEach((i) => {
        this.recipes[i.id] = i;
        if (this.categories[i.category] === undefined) {
          this.categories[i.category] = [];
        }
        if (i.shownOnUI === true) {
          this.categories[i.category].push(i);
        }
      });
      Object.keys(this.categories).forEach((c) =>
        this.categories[c].sort((a, b) => {
          const nameA = a.label.toUpperCase();
          const nameB = b.label.toUpperCase();
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        })
      );

      let smQuery = ResponsiveUtils.getFrameworkQuery(
        ResponsiveUtils.FRAMEWORK_QUERY_KEY.SM_ONLY
      );
      this.smScreen =
        ResponsiveKnockoutUtils.createMediaQueryObservable(smQuery);
    }

    

    isRecipe(recipe) {
      return this.recipes[recipe] !== undefined;
    }

    isNotHomePage(currentFlow) {
      return currentFlow !== "home";
    }

    _matches(recipe, fullTextWord) {
      let match = false;
      searchables.forEach((f) => {
        if (recipe[f].toUpperCase().indexOf(fullTextWord) >= 0) {
          match = true;
        }
      });
      return match;
    }

    isValidFilter(filter) {
      if (filter.includes("|")) {
        return categories.includes(filter.split("|")[0]) && subCategories.includes(filter.split("|")[1]);
      } else {
        return categories.includes(filter);
      }
    }

    sortRecipes(recipes) {
      recipes.sort((a, b) => {
        const nameA = a.label.toUpperCase();
        const nameB = b.label.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
    }

    getMatchedRecipes(filter, fullText) {
      let category;
      let subCategory;
      const self = this;
      let ignoreFilter = false;
      if (filter !== undefined && filter !== "all") {
        let x = filter.split("|");
        category = x[0];
        subCategory = x.length > 1 ? x[1] : undefined;
        if (!this.isValidFilter(filter)) {
          // wrong URL param passed in; ignore the filter
          ignoreFilter = true;
        }
      }
      let data = this.metadata.filter((recipe) => {
        if (!ignoreFilter && filter !== undefined && filter !== "all") {
          if ( recipe.category !== category || 
            (subCategory !== undefined && recipe.subCategory !== subCategory)) {
            return false;
          }
        }
        if (fullText !== undefined && fullText !== "" && fullText !== null ) {
          const fullTextWords = fullText.toUpperCase().split(" ");
          let count = 0;
          fullTextWords.forEach((word) => {
            if (self._matches(recipe, word)) {
              count++;
            }
          });
          return count === fullTextWords.length;
        }

        return true;
      });
      this.sortRecipes(data);
      return new ArrayDataProvider(data, {
        keyAttributes: "id",
        textFilterAttributes: searchables,
      });
    }

    /**
     * Returns recipe metadata from vb-demos.json for given current page
     */
    getRecipeMetadataForPage(currentPage) {
      const recipeId = currentPage.path.split("/")[1];
      return this.recipes[recipeId];
    }

    /**
     * Returns recipe metadata from vb-demos.json for given recipe ID
     */
    getRecipeMetadata(recipeId) {
      return this.recipes[recipeId];
    }

    getCategoryRecipes(category) {
      return this.categories[category];
    }

    isMobileDevice() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|Windows Phone/i.test(
        navigator.userAgent
      );
    }
  }

  return AppModule;
});
