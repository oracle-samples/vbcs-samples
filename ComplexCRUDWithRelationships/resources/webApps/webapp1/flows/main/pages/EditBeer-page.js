/* jshint esversion: 6 */
define([], function () {
    'use strict';

    var PageModule = function PageModule() {};

    /**
     * Describe one REST call with its params and payload to execute as part
     * of Batch REST. Typically you call this method many times for all
     * REST calls you wanna execute in batch. Store returned JSON in an array
     * and later call Batch REST with this array, ie.:
     *          "module": "vb/action/builtin/restAction",
     *              "parameters": {
     *                  "endpoint": "businessObjects/batch",
     *                  "body": "{{ $variables.Your-Array-of-JSONs }}"
     *              }
     *
     * @param {type} url endpoint URL
     * @param {type} payload payload for the endpoint
     * @param {type} operation type: create or delete or update
     * @param {type} id optional ID to identify Batch part
     * @returns {JSON} JSON to be added into array of steps which
     *      Batch REST should execute
     */
    PageModule.generateBatchSnippet = function (url, payload, operation, id) {
        return {
            id: id ? id : "someID",
            path: url,
            operation: operation,
            payload: payload ? payload : {}
        };
    };

    // solution to store beer and beer quality changes in one transaction using
    // RAMP Batch REST. This method creates payload with all the changes.
    PageModule.prototype.createPayload = function (beerRecord, selectedQualities) {

        // first figure out which beer qualities were removed and added so that
        // beer quality children can be deleted and created:
        var qualitiesToDelete = beerRecord.beerQualityCollection.items.
                filter(q => selectedQualities.indexOf(q.quality) === -1).
                map(q => q.id);
        var originalQualities = beerRecord.beerQualityCollection.items.map(q => q.quality);
        var qualitiesToAdd = selectedQualities.
                filter(q => originalQualities.indexOf(q) === -1);

        // create batch snippets for beer update and creation and removal of beer qualities:
        var payloads = [];
        payloads.push(PageModule.generateBatchSnippet(
                "/Beer/"+beerRecord.id,
                {
                    name: beerRecord.name,
                    alcoholPercentage: beerRecord.alcoholPercentage,
                    imageURL: beerRecord.imageURL,
                    country: beerRecord.country,
                    beerType: beerRecord.beerType
                }, 'update')
        );
        payloads = payloads.concat(
                qualitiesToAdd.map(q => PageModule.generateBatchSnippet(
                        "/Beer/"+beerRecord.id+"/child/beerQualityCollection",
                        {quality: q}, 'create')),
                qualitiesToDelete.map(q => PageModule.generateBatchSnippet(
                        "/Beer/"+beerRecord.id+"/child/beerQualityCollection/"+q,
                        {}, 'delete')));

        return {parts: payloads};
    };

    return PageModule;
});
