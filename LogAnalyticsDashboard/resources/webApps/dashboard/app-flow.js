/**
 * Copyright (c)2023 Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */

define(["vb/helpers/rest"], (Rest) => {
  'use strict';

  class AppModule {

    getTimePickerOptions() {

      const timeZone = new Intl.DateTimeFormat().resolvedOptions().timeZone;

      const now = new Date();
      const minus15 = new Date(now.getTime() - 15 * 60000);
      const minus30 = new Date(now.getTime() - 30 * 60000);
      const minus8h = new Date(now.getTime() - 8 * 60 * 60000);
      const minus7d = new Date(now.getTime() - 7 * 24 * 60 * 60000);
      const minus14d = new Date(now.getTime() - 14 * 24 * 60 * 60000);
      const minus60d = new Date(now.getTime() - 60 * 24 * 60 * 60000);

      const rows = [];
      this._push(rows, "Last 15 Minutes", minus15, now, timeZone);
      this._push(rows, "Last 30 Minutes", minus30, now, timeZone);
      this._push(rows, "Last 8 Hours", minus8h, now, timeZone);
      this._push(rows, "Last 7 Days", minus7d, now, timeZone);
      this._push(rows, "Last 14 Days", minus14d, now, timeZone);
      this._push(rows, "Last 2 Months", minus60d, now, timeZone);

      return rows;
    }

    _push(a, l, start, end, tz) {
      a.push({ label: l, timeStart: start.toISOString(), timeEnd: end.toISOString(), timeZone: tz });
    }

    async fetchData(compartmentId, timeFilter, query) {

      // use OCI API Signature for authentication
      // single account it used to call all OCI REST endpoint
      return this.fetchData_OCI_API_Signature(compartmentId, timeFilter, query);

      // uses OAuth2 User Assertion token issues by VB app IDCS
      // sent to custom OCI API Gateway Function which verifies user identity
      // and can (in theory!) use user's identity to call OCI REST endpoints on behalf of user
      // return this.fetchData_Custom_OAuth_Function(compartmentId, timeFilter, query);
    }

    async fetchData_Custom_OAuth_Function(compartmentId, timeFilter, query) {
      const postQueryResult = await Rest.get("oci-oauth/postQuery").body(
        {
          "subSystem": "LOG",
          "queryString": query,
          "shouldRunAsync": true,
          "shouldIncludeTotalCount": true,
          "compartmentId": compartmentId,
          "compartmentIdInSubtree": true,
          "scopeFilters": [
          ],
          "timeFilter": timeFilter,
          "maxTotalCount": 2000
        }
      ).fetch();

      if (postQueryResult.response.status !== 200) {
        return { error: true, message: JSON.stringify(postQueryResult.body) };
      }

      if (postQueryResult.body.fetch_error) {
        return { error: true, message: JSON.stringify(postQueryResult.body.fetch_error) };
      }

      return { error: false, body: postQueryResult.body.response };
    }

    async fetchData_OCI_API_Signature(compartmentId, timeFilter, query) {
      const postQueryResult = await Rest.get("oci-signature/postQuery").body(
        {
          "subSystem": "LOG",
          "queryString": query,
          "shouldRunAsync": true,
          "shouldIncludeTotalCount": true,
          "compartmentId": compartmentId,
          "compartmentIdInSubtree": true,
          "scopeFilters": [
          ],
          "timeFilter": timeFilter,
          "maxTotalCount": 2000
        }
      ).fetch();

      if (postQueryResult.response.status !== 201) {
        return { error: true, message: JSON.stringify(postQueryResult.body) };
      }

      const workRequestId = postQueryResult.response.headers.get("Opc-Work-Request-Id");

      const delay = ms => new Promise(res => {setTimeout(res, ms);});
      let retries = 6;
      while (retries > 0) {
        retries--;
        const data = await Rest.get("oci-signature/getQuery").parameters(
          {
            workRequestId: workRequestId,
          }
        ).fetch();


        if (data.response.status !== 200) {
          return { error: true, message: JSON.stringify(postQueryResult.body) };
        } else if (data.body.percentComplete === 100) {
          return { error: false, body: data.body };
        }
        //console.log("response is not complete: body.percentComplete="+data.body.percentComplete);
        await delay(666);
      }
      return { error: true, message: "response not received in time" };

    }

  }

  return AppModule;
});
