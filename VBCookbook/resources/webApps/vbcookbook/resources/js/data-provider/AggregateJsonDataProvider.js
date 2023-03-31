/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
/* eslint-disable class-methods-use-this, max-classes-per-file */

'use strict';

// eslint-disable-next-line max-len
define(['./BaseAggregatesJsonDataProvider', './SmartSearchAndFilterJsonDataProvider', 'oj-sp/data-provider/DataProviderUtils', 'oj-sp/data-provider/DataProviderBindingContext', './BaseJsonDataProviderAggregateStrategy', 'ojs/ojconverterutils-i18n'], function(BaseAggregatesJsonDataProvider, SmartSearchAndFilterJsonDataProvider, DataProviderUtils, DataProviderBindingContext, BaseJsonDataProviderAggregateStrategy) {
  /**
     * Used by the dynamic UI driving the content of the filter popups. This form of the
     * aggregates DP has to load the static JSON from a path.  The other aggregate dp(s)
     * can be passed the same static data from the view model of the page.
     */
  class AggregateJsonDataProvider extends BaseAggregatesJsonDataProvider {
    constructor(options) {
      super([]);
      this._filterCriterion = options.filterCriterion;
      this._context = DataProviderBindingContext.getInstance().evaluateInContext('[[ $context ]]');
      this.deferredSearchDelegate = Promise.resolve(new SmartSearchAndFilterJsonDataProvider(this._context));
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
      return 'value';
    }

    getSearchTextFilterAttributes() {
      return ['label'];
    }

    getFilterChipToCriterionConverters() {
      const converters = new Map();

      return converters;
    }

    createItemsFromAggregates(aggregatesMap) {
      let { aggregateStrategy } = this._context;
      if (!aggregateStrategy) {
        aggregateStrategy = new BaseJsonDataProviderAggregateStrategy();
      }

      const selectedFilter = this._selectedFilter;

      return aggregateStrategy.createItemsFromAggregates(aggregatesMap, selectedFilter);
    }

    _getSelectedFilter(filterCriteria) {
      if (!filterCriteria) return null;

      if (filterCriteria.op === '$eq' && filterCriteria.value && filterCriteria.value.selectedFilter) {
        return filterCriteria.value.selectedFilter;
      }
      if (Array.isArray(filterCriteria.criteria)) {
        const { criteria } = filterCriteria;
        for (let i = 0; i < criteria.length; i++) {
          const filter = this._getSelectedFilter(criteria[i]);
          if (filter) return filter;
        }
      }

      return null;
    }

    fetchFirst(params) {
      // eslint-disable-next-line prefer-object-spread
      params = Object.assign({}, params);
      const bindingProvider = DataProviderBindingContext.getInstance();
      let filterCriterion = bindingProvider.evaluateInContext(this._filterCriterion);
      filterCriterion = DataProviderUtils.evalObservables(filterCriterion);
      let appliedFilters = DataProviderUtils.getExclusionaryFilters(filterCriterion);
      this._selectedFilter = this._getSelectedFilter(filterCriterion);

      const appliedFiltersToRemove = [this._indexOfSelectedFilter(this._selectedFilter, appliedFilters)];
      this._resolveAppliedFiltersDependenciesForRemoval(this._selectedFilter, appliedFiltersToRemove, appliedFilters);
      appliedFilters = appliedFilters.slice(0);
      this._removeAll(appliedFiltersToRemove, appliedFilters);

      filterCriterion = {
        op: '$eq', value: { filters: appliedFilters },
      };
      params.filterCriterion = filterCriterion;

      return super.fetchFirst(params);
    }

    _removeAll(appliedFiltersToRemove, appliedFilters) {
      appliedFiltersToRemove.sort();
      // eslint-disable-next-line space-infix-ops
      for (let i = appliedFiltersToRemove.length -1; i > -1; i--) {
        appliedFilters.splice(appliedFiltersToRemove[i], 1);
      }
    }

    _indexOfSelectedFilter(selectedFilter, appliedFilters) {
      let index;
      appliedFilters.find((e, i) => {
        if (e.filter === this._selectedFilter) {
          index = i;

          return e;
        }

        return undefined;
      });

      return index;
    }

    _resolveAppliedFiltersDependenciesForRemoval(parentFilterToRemove, appliedFiltersToRemove, appliedFilters) {
      for (let i = 0; i < appliedFilters.length; i++) {
        const chip = appliedFilters[i];
        if (Array.isArray(chip.dependencies)) {
          if (chip.dependencies.indexOf(parentFilterToRemove) > -1) {
            appliedFiltersToRemove.push(i);
            this._resolveAppliedFiltersDependenciesForRemoval(chip.filter, appliedFiltersToRemove, appliedFilters);
          }
        }
      }
    }
  }

  return AggregateJsonDataProvider;
});
