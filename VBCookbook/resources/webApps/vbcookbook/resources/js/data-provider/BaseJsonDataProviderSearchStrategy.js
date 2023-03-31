/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
/* eslint-disable class-methods-use-this */
// eslint-disable class-methods-use-this
// eslint-disable-next-line max-len
define([], () => {
  /**
   * Abstract class defining the interface needed by searching.
   */
  class BaseJsonDataProviderSearchStrategy {
    /**
     * @param {JsonDataProviderOptions} options
     */
    constructor(options) {
      this._options = options;
    }

    /**
     * return {Promise} promise resolving to the target dataset
     */
    loadData() {
      if (!this._dataLoadPromise) {
        this._dataLoadPromise = new Promise(resolve => {
          fetch(this._options.search.dataPath).then(response => response.json()).then(data => {
            this.shapeData(data);
            resolve(data);
          });
        });
      }

      return this._dataLoadPromise;
    }

    /**
     * Sub-class can override in order to shape the dataset in any way.
     * @param {*} data
     * @return {*}
     */
    shapeData(data) {
      return data;
    }

    /**
     * Sub-class should overrid to provided the ArrayDataProvider sort criteria describing
     * the target dataset.
     * @return {Map<string, Function>}
     */
    getSortComparators() {
      return null;
    }

    /**
     * Sub-class should override to provide the ArrayDataProvider implicit sort criteria.
     * @return {Array<{attribute:string, direction:string}>}
     */
    getImplicitSort() {
      return null;
    }

    /**
     * Sub-class should override to provide the key or keys identifiers of the target
     * dataset.
     * @return {string|string[]}
     */
    getKeyAttributes() {
      return null;
    }

    /**
     * Sub-class should override to provider the fields the target dataset should be
     * search on for a text search.
     * @return {string[]}
     */
    getSearchTextFilterAttributes() {
      return null;
    }

    /**
     * Sub-class must overrride and provide a map of conversion function where the name
     * of the filter is the key and the value is a function.  The function will be passed
     * a filterChip and should return an ArrayDataProvider criterion.
     * @return {Map<string, Function>}
     */
    getFilterChipToCriterionConverters() {
      return null;
    }

    /**
     * Returns a Map of functions where the key corresponds to the filter name and the
     * callback function is passed the target item and a Map to hold the data aggregations
     * that are used to populate the applied filters popups and filter counts.
     * @return {Map<string, Function>}
     */
    getFilteredItemToAggregators() {
      return null;
    }
  }

  return BaseJsonDataProviderSearchStrategy;
});
