define([], function () {

    'use strict';

    /**
     * Gets promise of loaded RJS modules.
     *
     * @param {string[]|string} modules list of modules IDs, or one module ID.
     * @returns {Promise} if just one module has been prequired,
     * then resolve to the module itself, otherwise array of loaded modules
     */
    return function (modules) {
        if (Object.prototype.toString.call(modules) !== '[object Array]') {
            modules = [modules];
        }
        return new Promise(function (fulfill, reject) {
            require(modules, function () {
                var result = modules.length === 1 ? arguments[0] : Array.prototype.slice.call(arguments);
                fulfill(result);
            }, reject);
        });
    };

});