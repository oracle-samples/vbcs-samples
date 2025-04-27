/**
 * Copyright (c)2020, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define(["ojs/ojhtmlutils", "text!resources/templates/editable-form-table-tmpl.html"], function (HtmlUtils, template) {
  "use strict";

  class PageModule {
    constructor() {}

    areDifferent(oldValue, newValue) {
      if (JSON.stringify(newValue) === JSON.stringify(oldValue)) return false;
      else return true;
    }

    getRowConfig($application, $flow, $page, $current, $listeners, $variables, row) {
      return {
        view: HtmlUtils.stringToNodeArray(template),
        data: {$application, $flow, $page, $current, $listeners, $variables, row}
      };
    }
  }

  return PageModule;
});
