define([], function() {
  'use strict';

  var PageModule = function PageModule() {};

  /**
   * fire an 'add' event on the ServiceDataProvider, to update the list without rebuilding the page
   * @param sdp ServiceDataProvider variable
   * @param record the record just added
   */
  PageModule.prototype.updateList = function (sdp, record) {
    var payload = {};
    payload.data = [];
    payload.keys = [];
    payload.indexes = [];

    if (sdp && record) {
      payload.data.push(record);
      payload.keys.push(record.id);
      payload.indexes.push(-1); // TODO we don't know the index to return

      sdp.handleEvent('add', payload);
    }
  };


  return PageModule;
});
