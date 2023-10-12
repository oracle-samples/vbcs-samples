/**
 * Copyright (c)2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */

define([], () => {
  'use strict';

  class AppModule {

    constructor(context) {
      this.eventHelper = context.getEventHelper();
    }

    startSSEListener() {

      console.log(">>>>>>>>>>listener created");
      const sseSource = new EventSource("http://127.0.0.1:8080/tasks-progress");
      
      sseSource.onmessage = (event) => {
        console.log(">>>>>>>>>>event "+event.data);

        const payload = JSON.parse(event.data);

        if (payload.length === 0) {
          sseSource.close();
          return;
        }

        this.eventHelper.fireCustomEvent("progress", {
          tasks: payload
        });
      };
      
    }

  }
  
  return AppModule;
});
