/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
/* eslint-disable class-methods-use-this */
// eslint-disable-next-line max-len
define(['./BaseJsonDataProviderSearchStrategy'], (BaseJsonDataProviderSearchStrategy) => {

  class CookbookSearchStrategy extends BaseJsonDataProviderSearchStrategy {
    /**
     * Sub-class can override in order to shape the dataset in any way.
     * @param {*} data
     * @return {*}
     */
    shapeData(data) {
      // data.forEach(record => {
      //   if (record.redwood === undefined) {
      //     record.redwood = "false";
      //   } else {
      //     record.redwood = "true";
      //   }
      // });
      return data;
    }

    /**
       * @return {Map<string, Function>}
       */
    getSortComparators() {
      if (this._sortComparators) { return this._sortComparators; }

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

      this._sortComparators = { comparators };

      return this._sortComparators;
    }

    /**
     * @return {Array<{attribute:string, direction:string}>}
     */
    getImplicitSort() {
      return [{ attribute: 'label', direction: 'ascending' }
      ];
    }

    /**
     * @return {string|string[]}
     */
    getKeyAttributes() {
      return 'id';
    }

    /**
     * @return {string[]}
     */
    getSearchTextFilterAttributes() {
      return ['label',
        // 'desc',
        'subCategory',
      ];
    }

    // getAutocompleteTextFilterAttributes() {
    //   return ['label',
    //     // 'desc',
    //     'categoryName',
    //   ];
    // }

    /**
       * @return {Map<string, Function>}
       */
    getFilterChipToCriterionConverters() {
      const converters = new Map();
      converters.set('RedwoodLOV', filterChip => {
        // console.log(">>>> filterChip.value="+JSON.stringify(filterChip, null, 2));
        if (filterChip.value === "Redwood Patterns") {
          return { op: '$eq', attribute: 'redwood', value: "true" }
        } else {
          // return all:
          return { op: '$ne', attribute: 'redwood', value: "xxx" }
        }
      });
      converters.set('CategoryLOV', filterChip => {
        const compoundFilter = {
          op: '$or',
          criteria: [],
        };
        // compoundFilter.criteria.push({
        //   op: '$sw', attribute: "categoryName", value: filterChip.value,
        // });
        compoundFilter.criteria.push({
          op: '$eq', attribute: "category", value: filterChip.value,
        });
        return compoundFilter;
      });
      converters.set('keyword', filterChip => {
        const compoundFilter = {
          op: '$or',
          criteria: [],
        };
        const textFilterAttributes = this.getSearchTextFilterAttributes();
        for (let i = 0; i < textFilterAttributes.length; i++) {
          compoundFilter.criteria.push({
            op: '$sw', attribute: textFilterAttributes[i], value: filterChip.value,
          });
        }
// console.log(">>>> compoundFilter="+JSON.stringify(compoundFilter, null, 2));
        return compoundFilter;
      });

// console.log(">>>> getFilterChipToCriterionConverters="+JSON.stringify(converters, null, 2));
// debugger;
      return converters;
    }

    /**
       * @return {Map<string, Function>}
       */
    getFilteredItemToAggregators() {
      if (this._aggregators) { return this._aggregators; }

      const aggregators = new Map();
      aggregators.set('RedwoodLOV', (item, redwoodMap) => {
        let redwoodCount = 0;
        const key = item.redwood === "true" ? "Redwood Patterns" : "All";
        if (redwoodMap.has(key)) {
          redwoodCount = redwoodMap.get(key);
        }
        redwoodMap.set(key, ++redwoodCount);

        if (item.redwood === "true") {
          let allCount = 0;
          const key = "All";
          if (redwoodMap.has(key)) {
            allCount = redwoodMap.get(key);
          }
          redwoodMap.set(key, ++allCount);
        }
      });
      aggregators.set('CategoryLOV', (item, categoryMap) => {
        // debugger;
        let categoryCount = 0;
        if (categoryMap.has(item.category)) {
          categoryCount = categoryMap.get(item.category);
        }
        if (item.category !== '') {
          categoryMap.set(item.category, ++categoryCount);
        }
      });
      aggregators.set('autocomplete', (item, autocompleteMap) => {
        let state = { count: 0, attributeLabel: 'Recipe Name' };
        if (autocompleteMap.has(item.label)) {
          state = autocompleteMap.get(item.label);
        }
        state.count += 1;
        autocompleteMap.set(item.label, state);

        // count = 0;
        // if (autocompleteMap.has(item.desc)) {
        //   count = autocompleteMap.get(item.desc);
        // }
        // autocompleteMap.set(item.desc, ++count);

        state = { count: 0, attributeLabel: 'Subcategory' };
        if (autocompleteMap.has(item.subCategory)) {
          state = autocompleteMap.get(item.subCategory);
        }
        state.count += 1;
        autocompleteMap.set(item.subCategory, state);

      });

      this._aggregators = aggregators;

// console.log(">>>> getFilteredItemToAggregators="+JSON.stringify(aggregators, null, 2));
      return this._aggregators;
    }
  }

  return CookbookSearchStrategy;
});
