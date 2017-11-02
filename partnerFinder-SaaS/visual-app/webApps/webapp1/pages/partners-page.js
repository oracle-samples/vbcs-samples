define([],function() {
  'use strict';

  var PageModule = function PageModule() {};

  // Filter transform function
  PageModule.prototype.filter = function(configuration, options) {
    var c = configuration;
    if (options && Array.isArray(options) && options.length > 0) {
      var firstItem = options[0]; // endpoint only supports filter for one field
      if (firstItem && firstItem.value) {
        var newUrl = c.url;
        newUrl = newUrl + '?q=' + firstItem.name + ' LIKE \'%' + firstItem.value + '%\'';
        c.url = newUrl;
      }
    }
    return c;
  };

  return PageModule;
});
