/**
 * Copyright (c)2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */

define([], () => {
  'use strict';

  class PageModule {

    getProgress(array, index, flag) {
      let prog = array[index].progress;
      return prog !== undefined ? (prog === 100 ? "Finished" : prog + "%") : "";
    }
  }
  
  return PageModule;
});
