/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define(['ojs/ojarraytreedataprovider', 'vb/BusinessObjectsTransforms'], function (ArrayTreeDataProvider, BOTransforms) {
  'use strict';

  var PageModule = function PageModule() { };

  // this function adds a new field fullName in data
  PageModule.prototype.customizeData = function (restResponse) {
    if (restResponse.body.items.length > 0) {
      restResponse.body.items.forEach(
        function (item) {
          item.fullName = item.firstName + ' ' + item.lastName;
        }
      );
    }
    return restResponse;
  };

  // this function creates a customized oj-option item containing firstName, lastName, phoneNumber, and employee picture
  PageModule.prototype.createDropdownItemFunction = function (applicationPath) {
    return function (context) {
      const ojOption = document.createElement('oj-option');
      ojOption.innerHTML = context.data.firstName + ' ' + context.data.lastName + ' ' + context.data.phoneNumber + '  ';
      ojOption.setAttribute('class', 'oj-sm-align-items-center oj-flex');

      const avatar = document.createElement('oj-avatar');
      avatar.setAttribute('src', applicationPath + 'resources/images/employees/' + context.data.id + '.png');
      avatar.setAttribute('size', 'sm');
      avatar.setAttribute('shape', 'circle');
      avatar.setAttribute('slot', 'startIcon');
      avatar.setAttribute('class', 'oj-sm-padding-4x-end');
      ojOption.appendChild(avatar);

      return ojOption;
    }
  };

  // this function is called through requestTransformFunctions, and it appends the object fields 
  // configured as text filter attributes for filtering.
  PageModule.prototype.processFilter = function (configuration, options, transformsContext) {
    var textValue = options && options.value;

    if (textValue !== undefined && transformsContext && transformsContext['vb-textFilterAttributes']) {
      var options_new = {
        op: '$or',
        criteria: [
        ]
      };

      for (var i = 0; i < transformsContext['vb-textFilterAttributes'].length; i++) {
        var itemCriterion = {};
        itemCriterion.attribute = transformsContext['vb-textFilterAttributes'][i];
        itemCriterion.op = '$co';
        itemCriterion.value = textValue;
        options_new.criteria.push(itemCriterion);
      }

      // - NOTE -
      // below assignment override any existing FilterCriterion set on SDP.
      // proper solution is to merge options_new into existing conditions
      options = options_new;
    }

    return BOTransforms.request.filter(configuration, options);
  };

  return PageModule;
});