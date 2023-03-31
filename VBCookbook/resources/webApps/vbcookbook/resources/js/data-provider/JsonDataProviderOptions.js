/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
/* eslint-disable class-methods-use-this, max-classes-per-file */

'use strict';

define([], () => {
  class JsonDataProviderOptions {
    /**
     * @param {search: {dataPath: string},
     *         filters: {dataPath: string},
     *         recentSearch: {storageKey: string}}
     *         options
     */
    constructor(options) {
      this._search = new BaseOptions(options.search.dataPath);
      Object.defineProperty(this, 'search', {
        get: () => this._search,
      });
      this._filters = new BaseOptions(options.filters.dataPath);
      Object.defineProperty(this, 'filters', {
        get: () => this._filters,
      });
      this._recentSearch = new RecentSearchOptions(options.recentSearch.storageKey);
      Object.defineProperty(this, 'recentSearch', {
        get: () => this._recentSearch,
      });
    }
  }

  class BaseOptions {
    constructor(dataPath) {
      this._dataPath = dataPath;
      Object.defineProperty(this, 'dataPath', {
        get: () => this._dataPath,
      });
    }
  }

  class RecentSearchOptions {
    constructor(storageKey) {
      this._storageKey = storageKey;
      Object.defineProperty(this, 'storageKey', {
        get: () => this._storageKey,
      });
    }
  }

  return JsonDataProviderOptions;
});
