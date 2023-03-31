/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([], function() {
  'use strict';

  var PageModule = function PageModule() {};

  /**
   *
   * @param {String} id
   * @return {String}
   */
  PageModule.prototype.validateForm = function(id) {
    var el = document.getElementById(id);
    if (el.valid === 'valid') {
      return true;
    } else {
      el.showMessages();
      el.focusOn('@firstErrorShown');
      return false;
    }
  };


  PageModule.generateBatchSnippet = function(url, payload, operation, id) {
    return {
      id: id ? `part-${id}` : "someID",
      path: url,
      operation: operation,
      payload: payload ? payload : {}
    };
  };

  /**
   * Creates batch payload
   * @param {type} employee
   * @param {type} selectedSkills
   * @return {undefined}
   */
  PageModule.prototype.batchPayloadForEdit = function(employee,
    selectedSkills) {

    var skillsToDelete = employee.employeeSkillCollection.items.
    filter(q => selectedSkills.indexOf(q.skill) === -1).
    map(q => q.id);
    var originalSkills = employee.employeeSkillCollection.items.map(q =>
      q.skill);
    var skillsToAdd = selectedSkills.
    filter(q => originalSkills.indexOf(q) === -1);

    var payloads = [];
    payloads.push(PageModule.generateBatchSnippet(
      "/Employee/" + employee.id, {
        firstName: employee.firstName
      }, 'update', 'employee'));
    payloads = payloads.concat(
      skillsToAdd.map(q => PageModule.generateBatchSnippet(
        "/Employee/" + employee.id + "/child/employeeSkillCollection", {
          skill: q
        }, 'create', q)),
      skillsToDelete.map(q => PageModule.generateBatchSnippet(
        "/Employee/" + employee.id +
        "/child/employeeSkillCollection/" + q, {}, 'delete', q)));

    return {
      parts: payloads
    };
  };
  return PageModule;
});