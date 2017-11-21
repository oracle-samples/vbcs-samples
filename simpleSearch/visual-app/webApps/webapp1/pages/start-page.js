define([], function() {
  'use strict';

  var PageModule = function PageModule() {};

/*
  Example of client-side transform function, not used in this sample. If used, client-side transform overrides server transform function. 
  To use, add following to the defaultValue section of contactsListServiceDataProvider:

                "transforms": {
                    "request": {
                        "filter": "{{ $page.functions.filter }}"
                    }
                }
*/  

/*
  PageModule.prototype.filter = function(configuration, options) {
    var c = configuration;
    if (options && Array.isArray(options) && options.length > 0) {
      var firstItem = options[0]; // endpoint only supports filter for one field
      if (firstItem && firstItem.value) {
        var newUrl = c.url;
        newUrl = newUrl + '?q=(' + firstItem.attribute + ' LIKE \'%' + firstItem.value + '%\') OR (firstname LIKE \'%' + firstItem.value + '%\')';
        c.url = newUrl;
      }
    }
    return c;
  };
*/
  
  return PageModule;
});
