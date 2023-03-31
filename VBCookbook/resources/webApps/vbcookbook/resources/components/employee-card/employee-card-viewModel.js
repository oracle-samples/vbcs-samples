/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([
  'knockout',
  'ojs/ojcontext',
  'ojs/ojavatar'
], function (
  ko,
  ojContext
) {
  'use strict';

  function EmployeeCardComponentModel(context) {
    var self = this;
    this.initials = null;
    this.workFormatted = null;
    var element = context.element;

    if (context.properties.name) {
      var initials = context.properties.name.match(/\b\w/g);
      this.initials = (initials.shift() + initials.pop()).toUpperCase();
    }

    this.flipCard = function (event) {
      if (event.type === 'click' || (event.type === 'keypress' && event.keyCode === 13)) {
        // It's better to look for View elements using a selector
        // instead of by DOM node order which isn't guaranteed.
        element.querySelector('.employee-card-flip-container').classList.toggle('employee-card-flipped');


      }
    };
  }

  // Lifecycle methods - uncomment and implement if necessary.
  // EmployeeCardComponentModel.prototype.activated = function(context){
  // };

  // EmployeeCardComponentModel.prototype.connected = function(context){
  // };

  // EmployeeCardComponentModel.prototype.bindingsApplied = function(context){
  // };

  // EmployeeCardComponentModel.prototype.propertyChanged = function(propertyChangedContext){
  // };

  // EmployeeCardComponentModel.prototype.disconnected = function(element){
  // };

  return EmployeeCardComponentModel;
});