/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define(["ojs/ojrowdatagridprovider"], (RowDataGridProvider) => {
  "use strict";

  class PageModule {
    constructor() {}

    /**
     *
     * @param {String} sdp
     * @return {String}
     */
    getRowGridDataProvider(sdp) {
      return new RowDataGridProvider.RowDataGridProvider(sdp, {
        columns: {
          rowHeader: ["id"],
          databody: ["firstName", "lastName", "phoneNumber", "email", "salary"],
        },
        columnHeaders: {
          column: [
            { data: "First Name" },
            { data: "Last Name" },
            { data: "Phone Number" },
            { data: "Email" },
            { data: "Salary" },
          ],
        },
        headerLabels: {
          row: ["Id"],
        },
      });
    }

    columnHeaderStyle(headerContext) {
      if (headerContext.index == 3) {
        // if email
        return "width:230px;";
      } else if (headerContext.index == 2) {
        // if phoneNumber
        return "width:160px;";
      }

      return "width:120px;";
    }

    getCellClassName(cellContext) {
      return "oj-helper-justify-content-center";
    }
  }

  return PageModule;
});
