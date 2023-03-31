/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
/* eslint-disable class-methods-use-this */
// eslint-disable-next-line max-len
define(['./BaseJsonDataProviderFiltersStrategy'], BaseJsonDataProviderFiltersStrategy => {
  class CookbookFiltersStrategy extends BaseJsonDataProviderFiltersStrategy {
    /**
     * @return {Map<string, Function}
     */
    getFilterChipToCriterionConverters() {
      const converters = new Map();
      converters.set('RedwoodLOV', filterChip => ({
        op: '$ne', attribute: 'filter', value: filterChip.filter,
      }));
      converters.set('CategoryLOV', filterChip => ({
        op: '$ne', attribute: 'filter', value: filterChip.filter,
      }));

      return converters;
    }

    /**
       *
       */
    createItemsFromAggregates(aggregatesMap, filters, appliedFilters) {
      const data = [];
      const dependenciesFilters = [];
      // debugger;
      for (let i = 0; i < filters.length; i++) {
        // eslint-disable-next-line prefer-object-spread
        const filterChip = Object.assign({}, filters[i]);
        const map = aggregatesMap.get(filterChip.filter);

        const values = Array.isArray(filterChip.value) ? filterChip.value : [filterChip.value];
        // sum the counts for a multiselect filter chip
        for (let n = 0; n < values.length; n++) {
          if (map && map.has(values[n])) {
            if (Number.isNaN(Number.parseInt(filterChip.count, 10))) {
              filterChip.count = 0;
            }
            filterChip.count += map.get(values[n]);
          }
        }
        // removes dependent filters only adding if their dependency is an applied filter
        if (Array.isArray(filterChip.dependencies)) {
          dependenciesFilters.push(filterChip);
          // eslint-disable-next-line no-continue
          continue;
        }

        // eslint-disable-next-line no-restricted-globals, no-continue
        if (isNaN(filterChip.count) || filterChip.count === 0) { continue; }
        data.push(filterChip);
      }

      // insert dependency filters if parent is an applied filter. logic assumes the
      // nested dependencies are ordered in the data "static json" such that the child
      // is after the parent (a.k.a City follows State and State follows Country).
      if (Array.isArray(appliedFilters)) {
        for (let i = 0; i < dependenciesFilters.length; i++) {
          const dependencyChip = dependenciesFilters[i];
          if (dependencyChip.filter === 'keyword') {
            // eslint-disable-next-line no-continue
            continue;
          }

          for (let n = 0; n < appliedFilters.length; n++) {
            const fc = appliedFilters[n];
            if (dependencyChip.dependencies.indexOf(fc.filter) > -1 && dependencyChip.count > 0) {
              data.push(dependencyChip);
            }
          }
        }
      }

      return data;
    }
  }

  return CookbookFiltersStrategy;
});
