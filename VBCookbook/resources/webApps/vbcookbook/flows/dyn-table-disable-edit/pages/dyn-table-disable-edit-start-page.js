/**
 * Copyright (c)2020, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define(["ojs/ojkeyset"], (ojkeyset_1) => {
  'use strict';

  class PageModule {

    rowEditable(item) {
      let disabledKeys = [100, 102, 104];
      if (disabledKeys.includes(item.metadata.key)) {
        return 'off';
      } else {
        return 'on';
      }
    }
  }


  return PageModule;
});
