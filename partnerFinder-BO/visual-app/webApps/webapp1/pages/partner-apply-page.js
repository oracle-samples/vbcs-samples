define([],function() {
  'use strict';

  var PageModule = function PageModule() {};

  // Display message function
  PageModule.prototype.message = function(message) {
    var m = message;
    window.alert(m);
  };

  return PageModule;
});
