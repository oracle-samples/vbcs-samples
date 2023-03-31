/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([], () => {
  'use strict';

  class PageModule {
    wait() {
      var counter = 0;
      var start = new Date().getTime();
      var end = 0;
      while (counter < 2000) {
        end = new Date().getTime();
        counter = end - start;
      }
    }
  }

  return PageModule;
});
