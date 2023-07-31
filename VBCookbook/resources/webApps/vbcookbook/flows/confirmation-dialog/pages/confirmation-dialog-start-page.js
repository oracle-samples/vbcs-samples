/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([], function () {
  "use strict";

  class PageModule {
    constructor() {}

    // Returns true if there is an unsaved change (i.e. dirtyObject is not equivalent to cleanObject)
    unsavedChange(cleanObject, dirtyObject) {
      // Create arrays of property names for each Object
      let cleanProps = Object.getOwnPropertyNames(cleanObject);
      let dirtyProps = Object.getOwnPropertyNames(dirtyObject);

      // If number of properties is different, objects are not equivalent
      if (cleanProps.length !== dirtyProps.length) {
        return true;
      }

      for (let i = 0; i < cleanProps.length; i++) {
        let propName = cleanProps[i];

        // If values of same property are not equal, objects are not equivalent
        if (cleanObject[propName] !== dirtyObject[propName]) {
          return true;
        }
      }

      // If we made it this far, objects are considered equivalent
      return false;
    }
  }

  return PageModule;
});
