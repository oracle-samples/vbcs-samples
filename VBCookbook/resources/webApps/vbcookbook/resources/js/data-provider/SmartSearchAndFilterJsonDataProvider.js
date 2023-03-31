/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
/* eslint-disable class-methods-use-this, max-classes-per-file */

'use strict';

// eslint-disable-next-line max-len
define(['./BaseJsonDataProvider', 'ojs/ojconverterutils-i18n', 'oj-sp/data-provider/DataProviderUtils', './RecentSearchStorageManager'], (BaseJsonDataProvider, Converterutilsi18n, DataProviderUtils, RecentSearchStorageManager) => {
  /**
   * Performs a search based on the smart filter chips collected by components.
   * It's also used to produce subsets of aggregated results used by the other
   * data providers.
   */
  class SmartSearchAndFilterJsonDataProvider extends BaseJsonDataProvider {
    constructor(context, options) {
      const data = context.searchStrategy.loadData();
      super(data);
      this._context = context;
      if (options && options.filterCriterion) {
        this._filterCriterion = options.filterCriterion;
        this._recentsearch = RecentSearchStorageManager.getInstance(this._context.options.recentSearch.storageKey).getData();
      }
    }

    _hashCode(str) {
      let hash = 0;
      if (str.length === 0) {
        return hash;
      }
      for (let i = 0; i < str.length; i++) {
        const c = str.charCodeAt(i);
        // eslint-disable-next-line no-bitwise
        hash = ((hash << 5) - hash) + c;
        // eslint-disable-next-line no-bitwise
        hash &= hash;
      }

      return hash;
    }

    _saveRecentSearch(filterCriterion) {
      return Promise.resolve().then(() => {
        if (!filterCriterion || !Array.isArray(this._recentsearch)) return;
        filterCriterion = DataProviderUtils.evalObservables(filterCriterion);
        const filters = this.getAppliedFilters(filterCriterion);
        if (!Array.isArray(filters) || filters.length === 0) return;
        let hashCode = 0;
        const descTokens = [];
        for (let i = 0; i < filters.length; i++) {
          const chip = filters[i];
          if (chip.filter === 'keyword') {
            hashCode += this._hashCode(chip.value);
            descTokens.push(chip.value);
          } else {
            hashCode += this._hashCode(chip.filter);
            descTokens.push(chip.label);
          }
        }
        const id = hashCode.toString();
        const history = {
          id: id, description: descTokens.join(' '), chips: filters, category: 'history',
        };

        const storageManager = RecentSearchStorageManager.getInstance(this._context.options.recentSearch.storageKey);
        storageManager.markStateDirty();

        let index = -1;
        this._recentsearch.find((e, i) => {
          if (e.id === id) {
            index = i;

            return e;
          }

          return undefined;
        });
        if (index > -1) {
          this._recentsearch.splice(index, 1);
        }
        this._recentsearch.splice(0, 0, history);
      });
    }

    fetchFirst(params) {
      if (!this._filterCriterion) {
        return super.fetchFirst(params);
      }

      // eslint-disable-next-line prefer-object-spread
      params = Object.assign({}, params);
      params.filterCriterion = this._filterCriterion;
      this._saveRecentSearch(params.filterCriterion);

      return super.fetchFirst(params);
    }

    getSortComparators() {
      return this._context.searchStrategy.getSortComparators();
    }

    getImplicitSort() {
      return this._context.searchStrategy.getImplicitSort();
    }

    getKeyAttributes() {
      return this._context.searchStrategy.getKeyAttributes();
    }

    getSearchTextFilterAttributes() {
      return this._context.searchStrategy.getSearchTextFilterAttributes();
    }

    getFilterChipToCriterionConverters() {
      return this._context.searchStrategy.getFilterChipToCriterionConverters();
    }

    getFilteredItemToAggregators() {
      return this._context.searchStrategy.getFilteredItemToAggregators();
    }
  }

  return SmartSearchAndFilterJsonDataProvider;
});
