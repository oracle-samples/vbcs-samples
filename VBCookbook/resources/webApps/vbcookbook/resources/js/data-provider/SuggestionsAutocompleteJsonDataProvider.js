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
     * Builds type-ahead suggestions based on an aggregation of all unique names (first, middle and last).
     */
  class SuggestionsAutocompleteJsonDataProvider extends BaseAggregatesJsonDataProvider {
    constructor(context) {
      super([]);
      this._context = context;
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
      comparators.set('description', genericComparator);

      return { comparators };
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
      const converters = new Map();
      converters.set('keyword', filterChip => {
        const textFilterAttributes = this.getSearchTextFilterAttributes();
        if (!Array.isArray(textFilterAttributes)) return undefined;
        const compoundFilter = {
          op: '$and',
          criteria: [],
        };
        for (let i = 0; i < textFilterAttributes.length; i++) {
          compoundFilter.criteria.push({
            op: '$ne', attribute: textFilterAttributes[i], value: filterChip.value,
          });
        }
        if (compoundFilter.criteria.length === 1) {
          return compoundFilter.criteria[0];
        }

        return compoundFilter;
      });

      return converters;
    }

    createItemsFromAggregates(aggregatesMap) {
      const data = [];
      const autocompleteMap = aggregatesMap.get('autocomplete');
      if (autocompleteMap) {
        for (const [key, value] of autocompleteMap) {
          const suggestion = {
            id: [key, 'autocomplete'].join('|'),
            description: key,
            category: 'autocomplete',
            chips: [{
              filter: 'keyword', label: key, count: value.count, value: key,
              dynamicProps: { autocomplete: {attributeLabel: value.attributeLabel} }
            }],
          };
          data.push(suggestion);
        }
      }

      return data;
    }
  }

  return SuggestionsAutocompleteJsonDataProvider;
});
