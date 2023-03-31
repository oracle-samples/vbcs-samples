/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
// eslint-disable-next-line max-len
define([], () => {
  /**
     * Abstract class defining the interface needed by filtering.
     */
  class BaseJsonDataProviderFiltersStrategy {
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
          fetch(this._options.filters.dataPath).then(response => response.json()).then(data => {
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
     * Sub-class must overrride and provide a map of conversion function where the name
     * of the filter is the key and the value is a function.  The function will be passed
     * a filterChip and should return an ArrayDataProvider criterion.
     * @return {Map<string, Function}
     */
    getFilterChipToCriterionConverters() {
      return null;
    }

    /**
     * Returns an array of suggestion filters adding in aggregate counts.
     * @param {Map} aggregatesMap filter aggregations
     * @param {FilterChip[]} filters loaded via loadData from this strategy
     * @param {FilterChip[]} selected applied filters
     */
    createItemsFromAggregates(aggregatesMap, filters, appliedFilters) {
      return null;
    }
  }

  return BaseJsonDataProviderFiltersStrategy;
});
