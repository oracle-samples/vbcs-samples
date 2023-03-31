/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
//
// Example transforms for ORDS based REST service.
// Note that the demostration here showcases only how transforms 
// can be used to leverage the service capabilities. This example 
// does not enable all the capbilities of VBCS transforms and 
// hence of the service.
//

define(['urijs/URI'], function (URI) {
    'use strict';

    var Request = function () { };

    /**
     * Filter transform function
     * @param configuration
     * @param options the JSON payload that defines the filterCriteria
     * @returns {object} configuration object the url looks like ?filter=foo eq 'bar'.
     */
    Request.prototype.filter = function (configuration, options, transformsContext) {
        var filterCriterion = options;

        if (filterCriterion === undefined) {
            return configuration;
        }

        // following code is just an example and it assumes that
        // the SDP does not have any preconfigured filter criterion and
        // that there is only single "vb-textFilterAttributes" attribute set
        if (transformsContext['vb-textFilterAttributes'] !== undefined) {
            // in case the filtering comes from single select ui component
            // the search criteria details come in transformsContext
            var searchText = options && options.text;
            var textFilterAttributes = transformsContext && transformsContext['vb-textFilterAttributes'][0];
            options = { attribute: textFilterAttributes, op: "$co", value: searchText };
            filterCriterion = options;
        }

        var operation;
        var criteria = filterCriterion.criteria;

        if (criteria === undefined || criteria.length === 0) {
            if (filterCriterion.attribute && filterCriterion.op && filterCriterion.value) {
                criteria = [filterCriterion];
                operation = "$and";
            }
            else {
                return configuration;
            }
        }

        function transformOperator(fop) {
            switch (fop) {
                case '$co':
                    return '$instr';
                case '$le':
                    return '$lte';
                case '$ge':
                    return '$gte';
                default:
                    return fop;
            }
        }

        function isEmpty(val) {
            return (val === undefined || val === null || val === '');
        }

        if (filterCriterion && criteria && criteria.length > 0) {
            var q = [];

            criteria.forEach(function (item) {
                if (item.value === undefined || item.value === '%%' || item.value.length === 0) {
                    return;
                }

                var queryItem = {};
                queryItem[transformOperator(item.op)] = item.value;

                var queryJSON = {};
                queryJSON[item.attribute] = queryItem;

                q.push(queryJSON);
            });

            if (q.length > 0) {
                var query = {};

                if (operation === undefined) {
                    operation = filterCriterion.op;
                }
                if (operation === undefined) {
                    operation = "$and";
                }

                query[operation] = q;

                // ORDS query URL is for example:
                // .../ords/hr/emp?q={"$or":[{"ename":{"$instr":"martin"}},{"job":{"$like":"%developer%"}}]}
                configuration.url = addQParam(configuration.url, query);
            }
        }

        return configuration;
    };

    /**
     * Pagination function appends limit and offset parameters to the url
     * @param configuration
     * @param options the JSON payload that defines the pagination criteria
     * @returns {object} configuration object.
     */
    Request.prototype.paginate = function (configuration, options) {
        var newUrl = configuration.url;
        if (options && options.size) {
            newUrl = URI(newUrl).addSearch({ limit: options.size, offset: options.offset }).toString();
        }

        configuration.url = newUrl;
        return configuration;
    };

    /**
     * Sort transform function
     * @param configuration
     * @param options the JSON payload that defines the sort criteria
     * @returns {object} configuration object. the url looks like ?orderBy=foo:asc
     */
    Request.prototype.sort = function (configuration, options) {
        if (Array.isArray(options) && options.length > 0) {
            var firstItem = options[0];

            if (firstItem.attribute) {
                var dir = firstItem.direction === 'descending' ? 'DESC' : 'ASC';
                var sort = {"$orderby" : {}};
                sort["$orderby"][firstItem.attribute] = dir;

                // ORDS sort URL is for example:
                // ...ords/hr/emp?q={"$orderby":{"sal":"ASC"}}

                configuration.url = addQParam(configuration.url, sort);
            }
        }
        return configuration;
    };

    var addQParam = function (url, toAdd) {
        var query = URI(url).search(true);

        if (query.q) {
            toAdd = Object.assign(JSON.parse(query.q), toAdd);
        }
        query.q = JSON.stringify(toAdd);
        return URI(url).search(query).toString();
    };

    var Response = function () { };

    /**
     * Paginate Response Transform Function Implementation
     */
    Response.prototype.paginate = function (result) {
        var tr = {};

        if (result && result.body) {
            var cb = result.body;

            // ORDS does not support "totalCount" but only "hasMore"
            tr.hasMore = cb.hasMore;
        }

        return tr;
    };

    return { request: Request, response: Response };
});