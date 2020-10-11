/**
 * Copyright (c) 2020, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define(['ojs/ojknockout-keyset'], function(keySet) {
  'use strict';

  var PageModule = function PageModule() {};
  
  PageModule.prototype.selectedItems = new keySet.ObservableKeySet();

  return PageModule;
});
