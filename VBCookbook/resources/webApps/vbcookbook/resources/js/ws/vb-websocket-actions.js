define([
  'vb/action/actions',
  'vb/helpers/rest'
], (Actions, RestHelper) => {
  'use strict';

  /**
   * Helper class to manage WebSocket connections with automatic reconnection
   */
  class VBWebSocket {
    
    /**
     * Creates a new WebSocket connection helper
     * 
     * @param {string} url - The WebSocket server URL to connect to
     * @param {Map} queryParams (optional) specifies the query params before connecting.
     */
    constructor(context, url, queryParams, wsDataEventName) {
        this.url = url;
        this.queryParams = queryParams;
        this.shouldReconnect = true;
        this.ws = null;
        this.reconnectDelay = 5000;
        this.isReconnecting = false;
        this.alreadyEventedDisconnected = false;
        this.context = context;
        this.wsDataEventName = wsDataEventName;
    }

    _connect(updateQueryParams) {
      if (updateQueryParams)
        this.queryParams = updateQueryParams;

      // TODO close connection if it exists...

      let url = this.url;
      if (this.queryParams)
        url = this._appendQueryParams(this.url, this.queryParams);

      try {
          this.ws = new WebSocket(url);
      } catch (error) {
          throw new Error(`Failed to create WebSocket connection: ${error.message}`);
      }

      this.ws.onopen = () => {
          console.log('WebSocket connected');
          if (this.isReconnecting) {
            this.alreadyEventedDisconnected = false;
          }
          this.isReconnecting = false;
      };

      this.ws.onmessage = async (event) => {
        await Actions.fireEvent(this.context, {
          event: this.wsDataEventName,
          payload: {
            data : event.data
          }
        });
      };

      this.ws.onclose = () => {
          if (this.shouldReconnect) {
              this.isReconnecting = true;
              
              // update the system via events
              if (!this.alreadyEventedDisconnected) {
                this.alreadyEventedDisconnected = true;
                // this.reconnectEvents.forEach(fn => fn.call(null, true));
              }
              
              this._handleReconnect();
          }
      };

      this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          // this.errorEvents.forEach(fn => fn.call(null, error));
      };

      return this;
    }

    sendMessage(message) {
      this.ws.send(message);
    }

    /**
     * Sets the time (in ms) before a connection is retried if the connection is lost. Retries
     * will be attempted at this interval until a successful connection is performed.
     * 
     * @param {number} reconnectDelay time in millisecond
     * @returns the websocket
     */
    setReconnectDelayInMs(reconnectDelay) {
      this.reconnectDelay = reconnectDelay;

      return this;
    }



    /**
     * Cleanly disconnects the WebSocket connection and prevents auto-reconnection
     */
    disconnect() {
        this.shouldReconnect = false;
        if (this.ws) {
            this.ws.close();
            this.ws = null;
            console.log('Disconnected....');
        }
    }

    /**
     * Handles reconnection attempts
     * Will attempt to reconnect up to maxReconnectAttempts times with the reconnect delay
     */
    _handleReconnect() {
      if (!this.shouldReconnect) {
          console.log('Reconnection cancelled');
          return;
      }

      console.log('Attempting to reconnect... ');
      
      setTimeout(() => {
          this.connect();
      }, this.reconnectDelay); 
    }

    _appendQueryParams(urlString, params) {
      const url = new URL(urlString);
      const searchParams = url.searchParams;
      Object.entries(params).forEach(([key, value]) => {
          searchParams.append(key, value);
      });
      return url.toString();
   }
  }

  const VBWebsocketActions = {
    VBWebSocket
  };

  VBWebsocketActions.createWebSocket = async (context, websocketURL, queryParams, wsDataEventName) => {
    return (new VBWebSocket(context, websocketURL, queryParams, wsDataEventName))._connect();
  };

  VBWebsocketActions.createWebSocketFromEndpoint = async (context, endpointId, queryParams, wsDataEventName) => {
    // Get the URL from the service and operation - note that OpenAPI does not really support websockets, 
    // so we will have to extrapolate here, so we replace the protocol with 'ws'
    let websocketURL = await RestHelper.get(endpointId).toUrl();
    // todo: handle service not found...
    return VBWebsocketActions.createWebSocket(context, websocketURL, queryParams, wsDataEventName);
  };

  return VBWebsocketActions;
});
