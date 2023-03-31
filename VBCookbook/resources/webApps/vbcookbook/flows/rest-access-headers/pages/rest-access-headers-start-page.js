/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([], function() {
  'use strict';

  var PageModule = function PageModule() {};
  
  PageModule.prototype.getHeadersArray = function( responseHeaders )
  {
    var allHeaders = [];    
    var entries = responseHeaders.entries();
    
    for (const element of entries)
    {
      var item = {};
      item.key = element[0]; // header name
      item.value = element[1]; // header value
      allHeaders.push( item );
    }
    
    return allHeaders;
  }

  return PageModule;
});
