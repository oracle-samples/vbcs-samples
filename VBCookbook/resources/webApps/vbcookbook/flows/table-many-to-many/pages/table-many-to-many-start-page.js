/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define([], function () {
  "use strict";

  class PageModule {
    constructor() {}

    /**
     *
     * @param {String} id
     * @return {String}
     */
    validateForm(id) {
      let el = document.getElementById(id);
      if (el.valid === "valid") {
        return true;
      } else {
        el.showMessages();
        el.focusOn("@firstErrorShown");
        return false;
      }
    }

    generateBatchSnippet(url, payload, operation, id) {
      return {
        id: id ? `part-${id}` : "someID",
        path: url,
        operation: operation,
        payload: payload ? payload : {},
      };
    }

    /**
     * Creates batch payload
     * @param {type} employee
     * @param {type} selectedSkills
     * @return {undefined}
     */
    batchPayloadForEdit(employee, selectedSkills) {
      let skillsToDelete = employee.employeeSkillCollection.items
        .filter((q) => selectedSkills.indexOf(q.skill) === -1)
        .map((q) => q.id);
      let originalSkills = employee.employeeSkillCollection.items.map(
        (q) => q.skill
      );
      let skillsToAdd = selectedSkills.filter(
        (q) => originalSkills.indexOf(q) === -1
      );

      let payloads = [];
      payloads.push(
        this.generateBatchSnippet(
          "/Employee/" + employee.id,
          {
            firstName: employee.firstName,
          },
          "update",
          "employee"
        )
      );
      payloads = payloads.concat(
        skillsToAdd.map((q) =>
          this.generateBatchSnippet(
            "/Employee/" + employee.id + "/child/employeeSkillCollection",
            {
              skill: q,
            },
            "create",
            q
          )
        ),
        skillsToDelete.map((q) =>
          this.generateBatchSnippet(
            "/Employee/" + employee.id + "/child/employeeSkillCollection/" + q,
            {},
            "delete",
            q
          )
        )
      );

      return {
        parts: payloads,
      };
    }
  }

  return PageModule;
});
