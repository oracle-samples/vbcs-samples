/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
/* eslint-disable class-methods-use-this, max-classes-per-file */

'use strict';

// eslint-disable-next-line max-len
define([], () => {
  class RecentSearchStorageManager {
    constructor() {
      this._data = [];
      this._isDirty = false;
    }

    getData() {
      return this._data;
    }

    markStateDirty() {
      this._isDirty = true;
    }

    inquireAndResetDirtyState() {
      const isDirty = this._isDirty;
      if (isDirty) { this._isDirty = false; }

      return isDirty;
    }

    static getInstance(storageKey) {
      if (!storageKey) {
        storageKey = 'default';
      }

      if (!this._instances) {
        this._instances = new Map();
      }

      if (!this._instances.has(storageKey)) {
        this._instances.set(storageKey, new RecentSearchStorageManager());
      }

      return this._instances.get(storageKey);
    }
  }

  return RecentSearchStorageManager;
});
