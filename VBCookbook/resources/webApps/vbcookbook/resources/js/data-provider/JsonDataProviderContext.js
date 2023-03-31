/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
/* eslint-disable class-methods-use-this, max-classes-per-file */

define(['oj-sp/data-provider/DataProviderBindingContext'], DataProviderBindingContext => {
  class JsonDataProviderContext {
    constructor(options, searchStrategy, filtersStrategy, aggregateStrategy) {
      this._options = options;
      Object.defineProperty(this, 'options', {
        get: () => this._options,
      });
      this._searchStrategy = searchStrategy;
      Object.defineProperty(this, 'searchStrategy', {
        get: () => this._searchStrategy,
      });
      this._filtersStrategy = filtersStrategy;
      Object.defineProperty(this, 'filtersStrategy', {
        get: () => this._filtersStrategy,
      });
      this._aggregateStrategy = aggregateStrategy;
      Object.defineProperty(this, 'aggregateStrategy', {
        get: () => this._aggregateStrategy,
      });
      DataProviderBindingContext.getInstance().assignAvailableContext({ $context: this });
    }
  }

  return JsonDataProviderContext;
});
