/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
/* eslint-disable class-methods-use-this, max-classes-per-file */

'use strict';

// eslint-disable-next-line max-len
define(['./BaseAggregatesJsonDataProvider', './SmartSearchAndFilterJsonDataProvider'], (BaseAggregatesJsonDataProvider, SmartSearchAndFilterJsonDataProvider) => {
  /**
   * Assigned to the suggestion-filters component property. Returns a list of filters
   * to choose from along with aggregate counts.
   */
  class FiltersJsonDataProvider extends BaseAggregatesJsonDataProvider {
    constructor(context) {
      super([]);
      this._context = context;
      const fp = this._context.filtersStrategy.loadData();
      const sp = new Promise(resolve => {
        fp.then(f => {
          this._filters = f.items;
          resolve(new SmartSearchAndFilterJsonDataProvider(this._context));
        });
      });
      this.deferredSearchDelegate = sp;
    }

    getSortComparators() {
      const genericComparator = (a, b) => {
        if (a < b) {
          return -1;
        }
        if (a > b) {
          return 1;
        }

        return 0;
      };
      const comparators = new Map();
      comparators.set('label', genericComparator);

      return { comparators };
    }

    getImplicitSort() {
      return [{ attribute: 'label', direction: 'ascending' }];
    }

    getKeyAttributes() {
      return ['filter', 'value'];
    }

    getSearchTextFilterAttributes() {
      return ['label'];
    }

    getFilterChipToCriterionConverters() {
      return this._context.filtersStrategy.getFilterChipToCriterionConverters();
    }

    createItemsFromAggregates(aggregatesMap) {
      const filters = this._filters;
      const { appliedFilters } = this;

      return this._context.filtersStrategy.createItemsFromAggregates(aggregatesMap, filters, appliedFilters);
    }
  }

  return FiltersJsonDataProvider;
});
