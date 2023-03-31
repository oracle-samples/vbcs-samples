/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define(['ojs/ojkeyset', 'knockout'], function (keyset, ko) {
  'use strict';

  var PageModule = function PageModule() { };

  PageModule.prototype.selectedItems = ko.observable(new keyset.KeySetImpl());

  return PageModule;
});
