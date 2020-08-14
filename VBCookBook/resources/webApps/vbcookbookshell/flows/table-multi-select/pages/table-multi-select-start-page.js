/**
 * Copyright (c) 2018, 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
  define([], function() {
    "use strict";

    var PageModule = function PageModule() {};

    PageModule.prototype.checkboxSelection = function(selection, targetKey) {
      return selection.filter(function(s) {
        return s.startKey.row === targetKey
      }).length ? ['checked'] : [];
    };
    return PageModule;
  });