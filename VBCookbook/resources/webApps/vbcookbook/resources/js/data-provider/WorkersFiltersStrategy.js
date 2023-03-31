/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
/* eslint-disable class-methods-use-this */
// eslint-disable-next-line max-len
define(['./BaseJsonDataProviderFiltersStrategy'], BaseJsonDataProviderFiltersStrategy => {
  class WorkersFiltersStrategy extends BaseJsonDataProviderFiltersStrategy {
    /**
     * @return {Map<string, Function}
     */
    getFilterChipToCriterionConverters() {
      const converters = new Map();
      converters.set('GenderSS', filterChip => ({
        op: '$ne', attribute: 'filter', value: filterChip.filter,
      }));
      converters.set('PositionSM', filterChip => ({
        op: '$ne', attribute: 'filter', value: filterChip.filter,
      }));
      converters.set('SalaryRG', filterChip => ({
        op: '$ne', attribute: 'filter', value: filterChip.filter,
      }));
      converters.set('StartDateRG', filterChip => ({
        op: '$ne', attribute: 'filter', value: filterChip.filter,
      }));
      converters.set('AwardSC', filterChip => ({
        op: '$ne', attribute: 'filter', value: filterChip.filter,
      }));
      converters.set('CountrySS', filterChip => ({
        op: '$ne', attribute: 'filter', value: filterChip.filter,
      }));
      converters.set('StateSS', filterChip => ({
        op: '$ne', attribute: 'filter', value: filterChip.filter,
      }));
      converters.set('CitySS', filterChip => ({
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
      for (let i = 0; i < filters.length; i++) {
        // eslint-disable-next-line prefer-object-spread
        const filterChip = Object.assign({}, filters[i]);

        // simple filter chip that toggles value depending on the minute "Trending"
        if (filterChip.filter === 'AwardSC') {
          const today = new Date();
          filterChip.value = (today.getMinutes() % 2 === 0) ? 'casual' : 'fulltime';
        }
        const map = aggregatesMap.get(filterChip.filter);

        // set a default value for the State|City choosing the city with the highest count
        if ((filterChip.filter === 'CitySS' || filterChip.filter === 'StateSS') && !filterChip.value && map) {
          let lastHighestCount = -1;
          for (const [key, value] of map) {
            if (value > lastHighestCount) {
              lastHighestCount = value;
              filterChip.value = key;
            }
          }
        }

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

  return WorkersFiltersStrategy;
});
