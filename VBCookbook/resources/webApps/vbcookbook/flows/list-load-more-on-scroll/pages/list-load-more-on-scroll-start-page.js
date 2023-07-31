/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([], function () {
  "use strict";
  let backgroundArray = [
    "red",
    "orange",
    "forest",
    "green",
    "teal",
    "mauve",
    "purple",
  ];
  class PageModule {
    constructor() {}
    getInitials(fName, lName) {
      return `${fName.charAt(0)}${lName.charAt(0)}`.toUpperCase();
    }

    getBackground(emp) {
      const i = Math.floor(Math.random() * 11);
      return backgroundArray[i];
    }
  }

  return PageModule;
});
