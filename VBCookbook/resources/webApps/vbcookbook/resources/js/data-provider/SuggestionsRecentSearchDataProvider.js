/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
/* eslint-disable class-methods-use-this, max-classes-per-file */

'use strict';

// eslint-disable-next-line max-len
define(['./BaseJsonDataProvider', 'oj-sp/data-provider/DataProviderUtils', './RecentSearchStorageManager'], function(BaseJsonDataProvider, DataProviderUtils, RecentSearchStorageManager) {
  class SuggestionsRecentSearchDataProvider extends BaseJsonDataProvider {
    constructor(context) {
      super(RecentSearchStorageManager.getInstance(context.options.recentSearch.storageKey).getData());
      this._context = context;
    }

    getKeyAttributes() {
      return 'id';
    }

    getAutocompleteTextFilterAttributes() {
      return ['description'];
    }

    _isItemExcluded(filters, chips) {
      if (!Array.isArray(filters)) return false;
      if (!Array.isArray(chips)) return true;
      for (let n = 0; n < filters.length; n++) {
        const currentFilter = filters[n];
        for (let i = 0; i < chips.length; i++) {
          const recentFilter = chips[i];
          if (recentFilter.filter === 'keyword' && currentFilter.filter === 'keyword') {
            const currentText = currentFilter.value;
            const recentText = recentFilter.value;
            // eslint-disable-next-line no-continue
            if (!recentText || !currentText) continue;
            const res = currentText.match(new RegExp(recentText, 'gi'));
            if (Array.isArray(res) && res.length > 0) {
              return true;
            }
          } else if (recentFilter.filter === currentFilter.filter) {
            return true;
          }
        }
      }

      return false;
    }

    fetchFirst(params) {
      // force a new instance of the decorated ADP if storage has been mutated
      const storageManager = RecentSearchStorageManager.getInstance(this._context.options.recentSearch.storageKey);
      const isDirty = storageManager.inquireAndResetDirtyState();
      if (isDirty) {
        const data = storageManager.getData();
        this.init(data);
      }
   
      // eslint-disable-next-line prefer-object-spread
      params = Object.assign({}, params);
      params.size = 100;
      const orgAi = super.fetchFirst(params)[Symbol.asyncIterator]();
      let { filterCriterion } = params;
      if (!filterCriterion) return undefined;
      filterCriterion = DataProviderUtils.evalObservables(filterCriterion);
      const filters = this.getAppliedFilters(filterCriterion);
      const promise = new Promise(resolve => {
        orgAi.next().then(response => {
          const targetMetadata = [];
          const targetItems = [];
          const items = response.value.data;
          const { metadata } = response.value;
          for (let n = 0; n < items.length; n++) {
            // eslint-disable-next-line no-continue
            if (this._isItemExcluded(filters, items[n].chips)) continue;
            targetMetadata.push(metadata[n]);
            targetItems.push(items[n]);
            if (targetItems.length > 4) break; // limit of 5 items
          }
          resolve({
            done: true,
            value: {
              metadata: targetMetadata,
              data: targetItems,
              fetchParameters: params,
            },
          });
        });
      });
      const ai = {};
      ai[Symbol.asyncIterator] = () => ({
        next: () => promise,
      });

      return ai;
    }
  }

  return SuggestionsRecentSearchDataProvider;
});
