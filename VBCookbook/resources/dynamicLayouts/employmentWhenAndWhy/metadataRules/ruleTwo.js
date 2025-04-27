/**
 * Copyright (c)2020, 2025, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([], () => {
  'use strict';

  /**
   *
   * @param {object} context
   * @return {boolean}
   */
  function runCondition(context) {
    const { $componentContext, $fields, $modules, $user } = context;

    return $fields.positionsLov?.PositionCode?.value() === "POSCD3953";
  }

  /**
   * Default value expression for PersonNumber 
   * @param {object} context
   * @return {string}
   */
  function getDummyField(context) {
    const { $componentContext, $fields, $modules, $user } = context;

    return 'ruleTwo: lowercase: ' +
      $fields.positionsLov?.PositionCode?.value() +
      " " +
      $fields.positionsLov?.PositionName?.value()?.toLowerCase();
  }

  return { runCondition, getDummyField };
});
