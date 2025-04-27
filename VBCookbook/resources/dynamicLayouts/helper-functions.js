/**
 * Copyright (c)2020, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define(["knockout", 
    "vb/types/factories/serviceDataProviderFactory",
    "vb/BusinessObjectsTransforms",
], function (
  ko,
  ServiceDataProviderFactory,
  BOTransforms
) {
  "use strict";

  let sdpCache;

  const HelperFunctions = function HelperFunctions() { };

  HelperFunctions.prototype.createJobSDP = function() {
    if (sdpCache === undefined) {
      sdpCache = ko.observable();
      ServiceDataProviderFactory.createInstance({
        dataProviderOptions: {
          endpoint: "businessObjects/getall_Job",
          keyAttributes: "id",
          itemsPath: "items",
          transformsContext: {
            "vb-textFilterAttributes": [
              "jobTitle"
            ]
          },
          transforms: {
            request: {
              query: this.patchQueryURL
            }
          }
        },
      }).then((sdpInstance) => {
        sdpCache(sdpInstance);
      });

    }
    return sdpCache;
  };

  HelperFunctions.prototype.patchQueryURL = function(configuration, options, transformsContext) {
      const o = options;
      const c = configuration;
      let newUrl = c.url;
      if (newUrl.indexOf('jobTitle%20LIKE%20') >= 0) {
        newUrl = newUrl.replace("jobTitle%20LIKE%20", "UPPER(jobTitle)%20LIKE%20");
        newUrl = newUrl.replace("%20%27", "%20UPPER(%27%25");
        newUrl = newUrl.replace("%25%27", "%25%27)");
        
      }
      c.url = newUrl;

      return c;
  };

  return new HelperFunctions();
});