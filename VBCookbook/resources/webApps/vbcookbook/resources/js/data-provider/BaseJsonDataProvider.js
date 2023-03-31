/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
/* eslint-disable class-methods-use-this, max-classes-per-file */

'use strict';

// eslint-disable-next-line max-len
define(['knockout', 'oj-sp/data-provider/DataProviderUtils', 'ojs/ojarraydataprovider'], (ko, DataProviderUtils, ArrayDataProvider) => {
  /**
   * Base class data provider that works from a static JSON file instead of fetching
   * dynamic content.  The Jet ArrayDataProvider is used internally to perform sorting
   * and filtering.  The smart search filter criterion is converted into filter criterion
   * acting on the in-memory static dataset.
   *
   * Sub-class should override protected methods to implement the specifics of the
   * smart search.
   */
  class BaseJsonDataProvider {
    constructor(data) {
      this.init(data);
    }

    getCapability(capabilityName) {
      // not an async method
      if (this._delegate) {
        return this._delegate.getCapability(capabilityName);
      }

      const d = new ArrayDataProvider([], {});

      return d.getCapability(capabilityName);
    }

    isEmpty() {
      // not a async method
      if (this._delegate) {
        return this._delegate.isEmpty();
      }

      return 'unknown';
    }

    getTotalSize() {
      return this._deferredDelegate.then(delegate => delegate.getTotalSize());
    }

    addEventListener(eventType, listener) {
      if (!this._eventListeners) {
        this._eventListeners = [];
      }
      this._eventListeners.push({
        type: eventType.toLowerCase(),
        listener: listener,
      });
    }

    removeEventListener(eventType, listener) {
      if (this._eventListeners) {
        for (let i = this._eventListeners.length - 1; i >= 0; i--) {
          if (this._eventListeners[i].type === eventType && this._eventListeners[i].listener === listener) {
            this._eventListeners.splice(i, 1);
          }
        }
      }
    }

    dispatchEvent(evt) {
      let returnValue = false;
      if (this._eventListeners) {
        const eventListeners = this._eventListeners.slice(0);
        for (let i = 0; i < eventListeners.length; i++) {
          const eventListener = eventListeners[i];
          if (eventListener.type === evt.type) {
            returnValue = eventListener.listener.apply(this, [evt]);
            if (returnValue === false) break;
            else returnValue = true;
          }
        }
      }

      return returnValue;
    }

    fetchFirst(params) {
      // eslint-disable-next-line prefer-object-spread
      params = Object.assign({ includeFilteredRowCount: 'enabled' }, params);
      params.filterCriterion = this.convertFilterCriterion(params.filterCriterion);
      params.sortCriteria = this.getImplicitSort();

      let first = true;
      const aip = this._deferredDelegate.then(delegate => {
        return delegate.fetchFirst(params)[window.Symbol.asyncIterator]();
      });
      const ai = {};
      // eslint-disable-next-line arrow-body-style
      ai[window.Symbol.asyncIterator] = () => {
        return {
          next: () => {
            return aip.then(a => a.next().then(results => {
              if (first) {
                first = false;
                Promise.resolve().then(this._dispatchAfterFetchEvent(params, results));
              }
                
              return results;
            }));
          },
        };
      };

      return ai;
    }

    fetchByOffset(params) {
      // eslint-disable-next-line prefer-object-spread
      params = Object.assign({}, params);
      params.filterCriterion = this.convertFilterCriterion(params.filterCriterion);

      return this._deferredDelegate.then(delegate => delegate.fetchByOffset(params));
    }

    containsKeys(params) {
      return this._deferredDelegate.then(delegate => delegate.containsKeys(params));
    }

    fetchByKeys(params) {
      return this._deferredDelegate.then(delegate => delegate.fetchByKeys(params));
    }

    _fetchAggregates(fetchFirstIt, aggregationsMap, aggregatesMappingCallback) {
      return fetchFirstIt.next().then(fetchResults => {
        const { done } = fetchResults;
        const items = fetchResults.value.data;
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          aggregatesMappingCallback(item, aggregationsMap);
        }
        if (!done) {
          return this._fetchAggregates(fetchFirstIt, aggregationsMap, aggregatesMappingCallback);
        }

        return Promise.resolve();
      });
    }

    /**
         * Recursively fetches all the data based on the params returning a Map of aggregate counts
         * for each smart search filter.
         *
         * @param params fetch criteria
         */
    fetchAggregates(params) {
      // eslint-disable-next-line prefer-object-spread
      params = Object.assign({}, params);
      params.size = 100;
      const aggregationsMap = new Map();
      const aggregatesMappingCallback = this._getAggregatesMappingCallback.bind(this);
      const it = this.fetchFirst(params)[window.Symbol.asyncIterator]();

      return this._fetchAggregates(it, aggregationsMap, aggregatesMappingCallback).then(() => aggregationsMap);
    }

    _dispatchAfterFetchEvent(params, results) {
      let fetchSize = 0;
      const { value } = results;
      if (value) { fetchSize = value.totalFilteredRowCount; }
      const detail = {
        operation: 'fetchFirst',
        fetchParameters: params,
        fetchSize,
      };
      this.dispatchEvent(new DataProviderAfterfetchEvent({ detail }));
    }

    _getAggregatesMappingCallback(item, aggregatesMap) {
      const mappings = this.getFilteredItemToAggregators();
      if (!mappings) return;
      for (const [key, value] of mappings) {
        let filterMap = aggregatesMap.get(key);
        if (!filterMap) {
          filterMap = new Map();
          aggregatesMap.set(key, filterMap);
        }
        value(item, filterMap);
      }
    }

    /**
         * Returns a map of filter aggregates handlers where the key of the map is the logical
         * aggregate name and the value is a function that will sum for a type of aggregation
         * on each item of the filtered results.
         */
    getFilteredItemToAggregators() {
      return undefined;
    }

    /**
         * Used for setting up the internal ArrayDataProvider for controlling sorting
         * of results. Sub-classes should override and provide comparator callback
         * functions per sort attribute.
         */
    getSortComparators() {
      return undefined;
    }

    /**
         * Sub-classes should override to specify default sorting rules.  Used by the
         * internal ArrayDataProvider.
         */
    getImplicitSort() {
      return undefined;
    }

    /**
         * Sub-classes should override to define one or more attributes making up the primary
         * key. Used by the internal ArrayDataProvider.
         */
    getKeyAttributes() {
      return undefined;
    }

    /**
         * Sub-classes should override to define a list of attributes autocomplete type-ahead
         * filtering should apply too.
         */
    getAutocompleteTextFilterAttributes() {
      return undefined;
    }

    /**
         * Sub-classes should override to define a list of attributes keyword filter chips
         * should apply too.
         */
    getSearchTextFilterAttributes() {
      return undefined;
    }

    /**
         * Sub-classes should override to provide a map of smart filters to Jet DP
         * criterion where the key of the map is the filter name.
         */
    getFilterChipToCriterionConverters() {
      return new Map();
    }

    getAppliedFilters(filterCriteria) {
      if (!filterCriteria) return null;

      if (filterCriteria.value && Array.isArray(filterCriteria.value.filters)
        && filterCriteria.value.filters.length > 0) {
        return filterCriteria.value.filters;
      } if (Array.isArray(filterCriteria.criteria)) {
        const { criteria } = filterCriteria;
        for (let i = 0; i < criteria.length; i++) {
          const filters = this.getAppliedFilters(criteria[i]);
          if (Array.isArray(filters)) return filters;
        }
      }

      return null;
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
        for (let i = 0; i < filters.length; i++) {
          const filterChip = filters[i];
          if (converters.has(filterChip.filter)) {
            const f = converters.get(filterChip.filter)(filterChip);
            if (f) criteria.push(f);
          }
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

    init(data) {
      const dp = new Promise(resolve => {
        // simulate a rest call. need to wait for the smart-filters component to
        // create registering for the afterfetch event.
        window.setTimeout(() => { resolve(data); }, 50);
      });
      const rp = new Promise(resolve => {
        dp.then(d => {
          this._data = d;
          const options = {
            sortComparators: this.getSortComparators(),
            implicitSort: this.getImplicitSort(),
            keyAttributes: this.getKeyAttributes(),
          };
          const observable = ko.observableArray(d);
          this._delegate = new ArrayDataProvider(observable, options);

          resolve(this._delegate);
        });
      });
      this._deferredDelegate = rp;
    }
  }

  class GenericEvent {
    constructor(type, options) {
      this.type = type;
      this.options = options;
      if (options != null) {
        this.detail = options.detail;
      }
    }
  }
  class DataProviderAfterfetchEvent extends GenericEvent {
    constructor(options) {
      super('afterfetch', options);
    }
  }

  return BaseJsonDataProvider;
});
