/**
 * Copyright (c)2020, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([
  'vb/action/actionChain',
], ActionChain => {
  'use strict';

  class saveDataChain extends ActionChain {

    /**
     * <--Fill in custom save data logic in this action chain-->
     * @param {Object} context
     */
    async run() {
      // const { $page, $flow, $application } = context;
    }
  }

  return saveDataChain;
});
