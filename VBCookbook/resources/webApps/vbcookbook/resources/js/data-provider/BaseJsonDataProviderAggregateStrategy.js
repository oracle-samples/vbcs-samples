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
       * Abstract class defining the interface needed by the selected filters popup.
       */
  class BaseJsonDataProviderAggregateStrategy {
    /**
       * @param {JsonDataProviderOptions} options
       */
    constructor(options) {
      this._options = options;
    }

    /**
     * Returns an array of aggregate filters used to populate the filters popup.
     * @param {Map} aggregatesMap filter aggregations
     * @param {string} selectedFilter selected filter
     */
    createItemsFromAggregates(aggregatesMap, selectedFilter) {
      const data = [];
      const map = aggregatesMap.get(selectedFilter);
      if (map) {
        for (const [key, value] of map) {
          const filter = {
            label: key + ' (' + value + ')',
            value: key,
            count: value,
          };
          data.push(filter);
        }
      }

      return data;
    }
  }

  return BaseJsonDataProviderAggregateStrategy;
});
