/**
 * Copyright (c)2023 Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */

define([], () => {
  'use strict';

  class FragmentModule {

    getGroupLabel(group) {
      const d = new Date(group.ids[0]);
      return d.toLocaleTimeString();
    }

    getGroupComparator() {
      return function(a, b) {
        return a.ids[0] - b.ids[0];
      };
    }
  }
  
  return FragmentModule;
});
