/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
/* eslint-disable class-methods-use-this, max-classes-per-file */

'use strict';

// eslint-disable-next-line max-len
define(['./BaseJsonDataProvider', 'oj-sp/data-provider/DataProviderUtils'], (BaseJsonDataProvider, DataProviderUtils) => {
  /**
     * Base class used to derive aggregate results from the full set of static
     * data based on the smart search filters.
     */
  class BaseAggregatesJsonDataProvider extends BaseJsonDataProvider {
    /**
     * Called after all the aggregate counts are rolled up.  Sub-classes should override
     * to produce the target result set from the aggregate data.
     *
     * @param aggregatesMap map of aggregate counts
     */
    // eslint-disable-next-line no-unused-vars
    createItemsFromAggregates(aggregatesMap) {
      return undefined;
    }

    fetchFirst(params) {
      const p1 = params;
      const filterCriterion = DataProviderUtils.evalObservables(params.filterCriterion);
      this.appliedFilters = this.getAppliedFilters(filterCriterion);
      const aaiPromise = new Promise(resolve => {
        this.deferredSearchDelegate.then(delegate => delegate.fetchAggregates(p1).then(aggregatesMap => {
          const data = this.createItemsFromAggregates(aggregatesMap);
          this.init(data);
          const aai = super.fetchFirst(p1)[Symbol.asyncIterator];
          resolve(aai);
        }));
      });
      const ai = {};
      ai[Symbol.asyncIterator] = () => ({
        next: () => {
          const promise = new Promise(resolve => {
            aaiPromise.then(aai => {
              resolve(aai().next());
            });
          });

          return promise;
        },
      });

      return ai;
    }
  }

  return BaseAggregatesJsonDataProvider;
});
