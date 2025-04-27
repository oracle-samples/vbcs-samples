/**
 * Copyright (c)2020, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([
  'vb/action/actionChain',
  'vb/action/actions',
  'vb/action/actionUtils',
], (
  ActionChain,
  Actions,
  ActionUtils
) => {
  'use strict';

  class ScrollLeftActionChain extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application, $constants, $variables, $functions } = context;

      function scrollLeft() {
        let found;
        let leftStart = document
          .getElementById("downloaded-heading")
          .getBoundingClientRect().left;
        let width =
          document.getElementById("downloaded-heading").getBoundingClientRect()
            .width - 300;
        [...Array(12).keys()].forEach((ind) => {
          let e = document.getElementById("tile-" + ind);
          let tileStart = e.getBoundingClientRect().left;
          if (tileStart < leftStart - width) {
            found = e;
          }
        });
        if (found === undefined) {
          found = document.getElementById("tile-0");
        }
        if (found) {
          found.scrollIntoView();
        }
      }
      
      await scrollLeft();
    }
  }

  return ScrollLeftActionChain;
});
