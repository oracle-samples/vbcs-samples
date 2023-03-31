/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define(['knockout', 'vb/types/factories/serviceDataProviderFactory'], function (ko, ServiceDataProviderFactory) {
  'use strict';

  var sdpCache = {};

  var PageModule = function PageModule() {
  };

  PageModule.prototype.createSDP = function (deptNo) {
    if (sdpCache[deptNo] !== undefined) {
      return sdpCache[deptNo];
    }
    sdpCache[deptNo] = ko.observable();
    ServiceDataProviderFactory.createInstance(
      {
        dataProviderOptions:
        {
          endpoint: "businessObjects/getall_Employee",
          keyAttributes: "id",
          itemsPath: 'items',
          uriParameters: {
            "q": "department=" + deptNo,
            "limit": 25
          }
        }
      }
    ).then((sdpInstance) => {
      sdpCache[deptNo](sdpInstance);
    });
    return sdpCache[deptNo];
  };

  return PageModule;
});
