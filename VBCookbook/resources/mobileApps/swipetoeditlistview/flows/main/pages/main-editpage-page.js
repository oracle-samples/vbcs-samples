/**
 * Copyright (c)2020, 2021, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([], () => {
  'use strict';

  class PageModule {

    /**
     *
     * @param {String} arg1
     * @return {String}
     */
    validate_form(arg1) {
      const el = document.getElementById(arg1);
      if(el.valid === "valid"){
        return true;
      }else{
        el.showMessages();
        el.focusOn('@firstErrorShown');
        return false;
      }
    }
  }

  return PageModule;
});
