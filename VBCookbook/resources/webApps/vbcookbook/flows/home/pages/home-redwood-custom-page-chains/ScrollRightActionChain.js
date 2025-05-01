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

  class ScrollRightActionChain extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application, $constants, $variables, $functions } = context;

      function scrollRight() {
        let found;
        let rightEnd = document
          .getElementById("downloaded-heading")
          .getBoundingClientRect().right;
        let width =
          document.getElementById("downloaded-heading").getBoundingClientRect()
            .width - 300;
        [...Array(12).keys()].forEach((ind) => {
          let e = document.getElementById("tile-" + ind);
          let tileEnd = e.getBoundingClientRect().left + 300;
          if (tileEnd > rightEnd + width) {
            if (found === undefined) {
              found = e;
            }
          }
        });
        if (found === undefined) {
          found = document.getElementById("tile-11");
        }
        if (found) {
          found.scrollIntoView();
        }
      }

      await scrollRight();
    }
  }

  return ScrollRightActionChain;
});
