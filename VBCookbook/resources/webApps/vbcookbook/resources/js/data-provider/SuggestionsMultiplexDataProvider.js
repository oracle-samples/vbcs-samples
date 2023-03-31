/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
/* eslint-disable class-methods-use-this, max-classes-per-file */

'use strict';

// eslint-disable-next-line max-len
define(['oj-sp/data-provider/DataProviderUtils'], function(DataProviderUtils) {
  /**
     * Federated data provider which combines results from two dependent suggestions data providers building
     * a single results set of suggestions.  This example only has two sources of suggestions: suggestion filters,
     * and autocomplete.  Recent searches is the third source of suggestions.
     *
     * As per the UX spec, recent searches and suggestion filters are initially displayed in the suggestions
     * dropdown.  As the user starts typing, suggestions come from 3 sources.  In this example only 2 sources.
     * The oj-sp-smart-filter component expects all types of suggestions are in a heterogenous collection of
     * Suggestions.
     */
  class SuggestionsMultiplexDataProvider {
    constructor(options) {
      this._INITIAL_DATAPROVIDERS = ['recentsearch', 'filters'];
      this._ALL_DATAPROVIDERS = ['recentsearch', 'filters', 'autocomplete'];
      this._options = options;
    }

    getCapability(capabilityName) {
      if (capabilityName === 'sort') {
        return {
          attributes: 'multiple',
        };
      }
      if (capabilityName === 'fetchByKeys') {
        return null; // not implemented
      }
      if (capabilityName === 'fetchByOffset') {
        return {
          implementation: 'randomAccess',
        };
      }
      if (capabilityName === 'fetchCapability') {
        const exclusionFeature = new Set();
        exclusionFeature.add('exclusion');

        return {
          attributeFilter: {
            expansion: {},
            ordering: {},
            defaultShape: {
              features: exclusionFeature,
            },
          },
        };
      }
      if (capabilityName === 'filter') {
        return {
          textFilter: 'on',
          operators: ['$and', '$eq', '$ne'],
        };
      }

      return null;
    }

    getTotalSize() {
      return Promise.resolve(-1);
    }

    isEmpty() {
      return 'unknown';
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
      let ai;
      const { filterCriterion } = params;
      const searchTerms = DataProviderUtils.getSearchTerms(filterCriterion);
      if (!searchTerms) {
        ai = this._federatedFetchFirst(this._INITIAL_DATAPROVIDERS, params, true);
      } else {
        ai = this._federatedFetchFirst(this._ALL_DATAPROVIDERS, params, true);
      }

      return ai;
    }

    fetchByOffset(params) {
      // not implemented
      const result = {
        done: true,
        fetchParameters: params,
        results: [],
      };

      return Promise.resolve(result);
    }

    _getDataProvider(dpKey) {
      return Promise.resolve(this._options[dpKey]);
    }

    _getDataProvidersIterators(dpKeys, params, context) {
      return new Promise(resolve => {
        // if exists in the context, return the cached list
        if (Array.isArray(context.dpIterators)) {
          resolve(context.dpIterators);

          return;
        }
        context.dpIterators = [];
        const { dpIterators } = context;

        const dpPromises = [];
        for (let i = 0; i < dpKeys.length; i++) {
          const promise = this._getDataProvider(dpKeys[i]);
          dpPromises.push(promise);
        }
        Promise.all(dpPromises).then(dps => {
          const dataProviders = [];
          for (let i = 0; i < dps.length; i++) {
            if (dps[i]) { dataProviders.push(dps[i]); }
          }

          const size = Math.round(params.size / dataProviders.length);
          // eslint-disable-next-line prefer-object-spread
          params = Object.assign({}, params);
          params.size = size;

          for (let i = 0; i < dataProviders.length; i++) {
            const dp = dataProviders[i];
            const it = dp.fetchFirst(params)[window.Symbol.asyncIterator]();
            dpIterators.push(it);
          }
          resolve(dpIterators);
        });
      });
    }

    _federatedFetchFirst(dpKeys, params, firstBlockOnly) {
      const ai = {};
      const context = {};

      // eslint-disable-next-line arrow-body-style
      ai[window.Symbol.asyncIterator] = () => {
        return {
          next: () => new Promise(resolve => {
            // iterators are cached in the context in the outer scope.
            this._getDataProvidersIterators(dpKeys, params, context).then(dpIterators => {
            // fetch the next block of data from the iterators
              const promises = [];
              for (let i = 0; i < dpIterators.length; i++) {
                const failGracefullyPromise = new Promise(failGracefullyResponse => {
                  dpIterators[i].next().then(response => failGracefullyResponse(response));
                });
                promises.push(failGracefullyPromise);
              }

              // wait for all the results; merge into a single resultset
              Promise.all(promises).then(responses => {
                const targetMetadata = [];
                const targetItems = [];
                const removeIndxs = [];
                for (let i = 0; i < responses.length; i++) {
                  const response = responses[i];
                  const { metadata, data } = response.value;
                  if (response.done) {
                    removeIndxs.push(i);
                  }
                  for (let n = 0; n < data.length; n++) {
                    targetMetadata.push(metadata[n]);
                    targetItems.push(data[n]);
                  }
                }

                // remove iterators that are done fetching
                for (let i = removeIndxs.length - 1; i > -1; i--) {
                  dpIterators.splice(removeIndxs[i], 1);
                }

                if (firstBlockOnly) dpIterators.length = 0;

                resolve({
                  done: (dpIterators.length === 0),
                  value: {
                    metadata: targetMetadata,
                    data: targetItems,
                    fetchParameters: params,
                  },
                });
              });
            });
          }),
        };
      };

      return ai;
    }

    containsKeys(params) {
      // not implemented
      const result = {
        containsParameters: params,
        results: undefined,
      };

      return Promise.resolve(result);
    }

    fetchByKeys(params) {
      // not implemented
      const itemsMap = undefined;
      const result = {
        fetchParameters: params,
        results: itemsMap,
      };

      return Promise.resolve(result);
    }
  }

  return SuggestionsMultiplexDataProvider;
});
