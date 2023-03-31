/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
/* eslint-disable class-methods-use-this, max-classes-per-file */

'use strict';

// eslint-disable-next-line max-len
define(['./BaseAggregatesJsonDataProvider', './SmartSearchAndFilterJsonDataProvider', 'oj-sp/data-provider/DataProviderUtils'], (BaseAggregatesJsonDataProvider, SmartSearchAndFilterJsonDataProvider, DataProviderUtils) => {
  /**
   * Builds suggestion filters for the suggestions dropdown.
   */
  class SuggestionsFiltersJsonDataProvider extends BaseAggregatesJsonDataProvider {
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
      comparators.set('description', genericComparator);

      return { comparators };
    }

    convertFilterCriterion(filterCriterion) {
      if (!filterCriterion) return undefined;
      filterCriterion = DataProviderUtils.evalObservables(filterCriterion);
      const filters = this.getAppliedFilters(filterCriterion);
      const searchText = DataProviderUtils.getSearchTerms(filterCriterion);
      if (!(filters || searchText)) return undefined;
      const criteria = [];
      const compoundAndFilter = {
        op: '$and',
        criteria: criteria,
      };
      const textFilterAttributes = this.getAutocompleteTextFilterAttributes();
      if (searchText && Array.isArray(textFilterAttributes)) {
        const compoundOrFilter = {
          op: '$or',
          criteria: [],
        };
        for (let i = 0; i < textFilterAttributes.length; i++) {
          compoundOrFilter.criteria.push({
            op: '$sw', attribute: textFilterAttributes[i], value: searchText,
          });
        }
        if (compoundOrFilter.criteria.length === 1) {
          criteria.push(compoundOrFilter.criteria[0]);
        } else {
          criteria.push(compoundOrFilter);
        }
      }
      const converters = this.getFilterChipToCriterionConverters();
      if (Array.isArray(filters)) {
        const scriteria = [];
        for (let i = 0; i < filters.length; i++) {
          const filterChip = filters[i];
          if (converters.has(filterChip.filter)) {
            const f = converters.get(filterChip.filter)(filterChip);
            if (f) scriteria.push(f);
          }
        }
        if (scriteria.length === 1) {
          criteria.push({op: '$exists', attribute: 'chips', criterion: scriteria[0]} );
        } else if (scriteria.length > 1) {
          criteria.push({op: '$exists', attribute: 'chips', criterion: {
            op: '$and',
            criteria: scriteria
          }} );          
        }
      }
      if (compoundAndFilter.criteria.length === 0) {
        return undefined;
      }
      if (compoundAndFilter.criteria.length === 1) {
        return compoundAndFilter.criteria[0];
      }

      return compoundAndFilter;
    }


    getImplicitSort() {
      return [{ attribute: 'description', direction: 'ascending' }];
    }

    getKeyAttributes() {
      return 'id';
    }

    getSearchTextFilterAttributes() {
      return ['description'];
    }

    getAutocompleteTextFilterAttributes() {
      return ['description'];
    }

    getFilterChipToCriterionConverters() {
      return this._context.filtersStrategy.getFilterChipToCriterionConverters();
    }

    createItemsFromAggregates(aggregatesMap) {
      const data = [];
      const filters = this._filters;
      for (let i = 0; i < filters.length; i++) {
        // eslint-disable-next-line prefer-object-spread
        const filterChip = Object.assign({}, filters[i]);
        const map = aggregatesMap.get(filterChip.filter);
        const values = Array.isArray(filterChip.value) ? filterChip.value : [filterChip.value];
        filterChip.count = 0;
        for (let n = 0; n < values.length; n++) {
          if (map && map.has(values[n])) {
            filterChip.count += map.get(values[n]);
          }
        }
        const suggestion = {
          id: [filterChip.filter, 'suggestion'].join('|'),
          description: filterChip.label,
          category: 'suggestion',
          chips: [filterChip],
        };
        data.push(suggestion);
      }

      return data;
    }
  }

  return SuggestionsFiltersJsonDataProvider;
});
