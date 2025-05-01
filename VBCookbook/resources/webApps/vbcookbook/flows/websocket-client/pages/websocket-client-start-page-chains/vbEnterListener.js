/**
 * Copyright (c)2020, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([
  'vb/action/actionChain',
  'vb/action/actions',
  'vb/action/actionUtils',
  'resources/js/ws/vb-websocket-actions'
], (
  ActionChain,
  Actions,
  ActionUtils,
  WebsocketActions
) => {
  'use strict';

  class vbEnterListener extends ActionChain {

    /**
     * @param {Object} context
     */
    async run(context) {
      const { $page, $flow, $application, $constants, $variables } = context;

      // $variables.wsActions = await WebsocketActions.createWebSocketFromEndpoint(context, "wsEcho/get", {}, "wsData");

      $variables.wsActions = await WebsocketActions.createWebSocket(context, "wss://echo.websocket.org", {}, "wsData");

    }
  }

  return vbEnterListener;
});
