/**
 * Copyright (c)2023 Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([], () => {
  'use strict';

  class PageModule {

    reshapeResponse(data) {
      return { body: {items : data.body.items.map(i => ({"value" : i["Field Value"], "label": i["Field Value"] + "(" + i["Count"] + ")" })) }};
    }

    formatExtraQuery(labelFilter) {
      return labelFilter !== "" && labelFilter !== null ? "Label = '"+labelFilter+"'" : "";
    }

  }
  
  return PageModule;
});
