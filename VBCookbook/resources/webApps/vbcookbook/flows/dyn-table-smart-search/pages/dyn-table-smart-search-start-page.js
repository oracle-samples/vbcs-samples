/**
 * Copyright (c)2020, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([], () => {
  'use strict';

  class PageModule {
  }
  function _deepClone(fc) {
    return JSON.parse(JSON.stringify(fc));
  }

  // Recursively inspects the filterCriterion for TextFilter which are keyword enabled (aka matchBy:¿phrase), removing from the criterion
  function _findKeywordFilters(filterCriterion, keywords) {
    if (!filterCriterion) { return null; }
    if (filterCriterion.text && filterCriterion.matchBy === 'phrase') {
      keywords.push(filterCriterion.text);

      return true;
    }
    if (Array.isArray(filterCriterion.criteria)) {
      const { criteria } = filterCriterion;
      for (let i = criteria.length - 1; i > -1; i--) {
        if (_findKeywordFilters(criteria[i], keywords)) {
          criteria.splice(i, 1);
        }
      }
    }

    return false;
  }

  // Converts the compound filter into its simplest form.
  function _normalizeCompoundFilter(filter) {
    if (filter.criteria.length === 0) {
      return null;
    } else if (filter.criteria.length === 1) {
      return filter.criteria[0];
    } else {
      return filter;
    }
  }

  // Splits the text into words
  function _splitIntoWords(text) {
    let tokens = text.split(/\W/);
    tokens = Array.isArray(tokens) ? tokens : [];
    // remove empty string tokens
    for (let i = tokens.length - 1; i > -1; i--) {
      if (!tokens[i]) {
        tokens.splice(i, 1);
      }
    }

    return tokens;
  }

  // Builds a contains with string match with the keywords 
  function _buildKeywordToFilter(keywordFilterAttributes, text) {
    const criteria = [];
    const compoundFilter = { op: '$or', criteria };
    keywordFilterAttributes.forEach(attributeName => {
      const words = _splitIntoWords(text);
      const attribute = `UPPER(${attributeName})`;
      words.forEach(val => {
        const value = val.toUpperCase();
        criteria.push({ op: '$co', attribute, value });
      });
    });

    return _normalizeCompoundFilter(compoundFilter);
  }

  function _convertAttributeFilterToAttributeFilterExpr(fc) {
    if (!fc.op || fc.attribute || typeof fc.value !== 'object') { return fc; }
    const path = [];
    let value = fc.value;
    let done = true;
    do {
      const keys = Object.keys(value);
      const key = keys[0];            // only support a single attribute per object
      value = value[key];
      path.push(key);
      done = (value === null || Array.isArray(value) || typeof value !== 'object');
    } while (!done);

    return { op: fc.op, attribute: path.join('.'), value };
  }

  function _convertToRAMP(fc) {
    // RAMP only supports AttributeFilterExpr which is a deprecated interface
    // Convert from the new syntax to what RAMP transforms understands
    if (!Array.isArray(fc.criteria)) {
      return _convertAttributeFilterToAttributeFilterExpr(fc);
    }
    if (Array.isArray(fc.criteria) && fc.op) {
      for (let i = 0; i < fc.criteria.length; i++) {
        let f = fc.criteria[i];
        if (Array.isArray(f.criteria)) {
          f = _convertToRAMP(f);
        } else {
          f = _convertAttributeFilterToAttributeFilterExpr(f);
        }
        fc.criteria[i] = f;
      }
    }

    return fc;
  }

  PageModule.prototype.getSearchMapFilterCriterion = function (keywordFilterAttributes) {

    if (!this._searchMapFilterCriterion) {
      //JS closure capturing the keyword fields.  Transforms keyword TextFilter into a RDBMS friendly search and AttributeFilter to AttributeExprFilter
      this._searchMapFilterCriterion = fc => {
        const filterCriterion = _deepClone(fc);
        const criteria = [];
        const compoundFilter = { op: '$and', criteria };

        const keywords = [];
        _findKeywordFilters(filterCriterion, keywords);
        if (Array.isArray(filterCriterion.criteria) && filterCriterion.$tag === '_root_') {
          // capture any remaining non-keyword filters
          filterCriterion.criteria.forEach(f => {
            criteria.push(f);
          });
        } else if (keywords.length === 0) {
          criteria.push(filterCriterion);
        }

        // transform into starts with filter criterion
        keywords.forEach(text => {
          const filter = _buildKeywordToFilter(keywordFilterAttributes, text);
          if (filter) { criteria.push(filter); }
        });

        return _convertToRAMP(_normalizeCompoundFilter(compoundFilter));
      };


      return this._searchMapFilterCriterion;
    }
  };
  return PageModule;
});