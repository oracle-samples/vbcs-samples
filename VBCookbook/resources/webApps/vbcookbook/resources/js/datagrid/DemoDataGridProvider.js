/**
 * Copyright (c)2020, 2023, Oracle and/or its affiliates.
 * Licensed under The Universal Permissive License (UPL), Version 1.0
 * as shown at https://oss.oracle.com/licenses/upl/
 */
define(["ojs/ojeventtarget"], function (ojeventtarget) 
{
  "use strict";
  class DemoDataGridProvider {
    constructor(dataValues, counts, rowStartHeaderValues, columnHeaderLabels, rowStartHeaderLabels, colEndHeaderLabel, colEndHeaderValues, rowEndHeaderLabel, rowEndHeaderValues) {
      this.dataValues = dataValues;
      this.rowStartHeaderValues = rowStartHeaderValues;
      this.columnHeaderLabels = columnHeaderLabels;
      this.rowStartHeaderLabels = rowStartHeaderLabels;
      this.counts = counts;
      this.colEndHeaderValues = colEndHeaderValues;
      this.colEndHeaderLabels = colEndHeaderLabel;
      this.rowEndHeaderValues = rowEndHeaderValues;
      this.rowEndHeaderLabels = rowEndHeaderLabel;
      this.dataAvailability = "all";
      this.fetchDelay = 0;
      this.version = 0;
      this.GridItem = class {
        constructor(metadata, data) {
          this.metadata = metadata;
          this.data = data;
        }
      };
      this.GridBodyItem = class {
        constructor(rowExtent, columnExtent, rowIndex, columnIndex, metadata, data) {
          this.rowExtent = rowExtent;
          this.columnExtent = columnExtent;
          this.rowIndex = rowIndex;
          this.columnIndex = columnIndex;
          this.metadata = metadata;
          this.data = data;
        }
      };
      this.GridHeaderItem = class {
        constructor(index, extent, level, depth, metadata, data) {
          this.index = index;
          this.extent = extent;
          this.level = level;
          this.depth = depth;
          this.metadata = metadata;
          this.data = data;
        }
      };
      this.FetchByOffsetGridResults = class {
        constructor(fetchParameters, rowDone, columnDone, rowOffset, columnOffset, rowCount, columnCount, totalRowCount, totalColumnCount, results, version, next) {
          this.fetchParameters = fetchParameters;
          this.rowDone = rowDone;
          this.columnDone = columnDone;
          this.rowOffset = rowOffset;
          this.columnOffset = columnOffset;
          this.rowCount = rowCount;
          this.columnCount = columnCount;
          this.totalRowCount = totalRowCount;
          this.totalColumnCount = totalColumnCount;
          this.results = results;
          this.version = version;
          this.next = next;
        }
      };
    }
    fetchByOffset(parameters) {
      return new Promise((resolve) => {
        // console.log(">>> fetchByOffset.params="+JSON.stringify(parameters, null, 2));
        const rowOffset = parameters.rowOffset;
        const columnOffset = parameters.columnOffset;
        const rowCount = Math.min(parameters.rowCount, this.counts.row - rowOffset);
        const columnCount = Math.min(parameters.columnCount, this.counts.column - columnOffset);
        const rowDone = rowOffset + rowCount >= this.counts.row;
        const columnDone = columnOffset + columnCount >= this.counts.column;
        const version = this.version;
        let databody = this.getDatabodyResults(parameters, 0, this.dataValues);
        let rowStartHeaderValues = this.getRowHeaderResults(this.rowStartHeaderValues, this.rowStartHeaderLabels);
        let columnHeaderLabels = this.getHeaderResults(this.columnHeaderLabels);
        let rowStartHeaderLabels;
        if (this.rowStartHeaderLabels != undefined) {
          rowStartHeaderLabels = [];
          this.rowStartHeaderLabels.forEach(item => {
            rowStartHeaderLabels.push(
              {
                "metadata": {},
                "data": {
                  "data": item
                }
              });
          });
        }

        let columnHeaderLabel = [
          {
            "metadata": {},
            "data": {
              "data": ""
            }
          }
        ];

        let rowEndHeaderValues = this.getHeaderResults(this.rowEndHeaderValues);
        let columnEndHeaderValues = this.getHeaderResults(this.colEndHeaderValues);
        let rowEndHeaderLabel = [
          {
            "metadata": {},
            "data": {
              "data": this.rowEndHeaderLabels
            }
          }
        ];
        let columnEndHeaderLabel = [
          {
            "metadata": {},
            "data": {
              "data": this.colEndHeaderLabels
            }
          }
        ];

        let results;
        let next;
        results = {
          // data for the grid
          databody: databody,
          // data for frozen header values
          rowHeader: rowStartHeaderValues,
          // grid data columns labels
          columnHeader: columnHeaderLabels,
          // frozen column labels
          rowHeaderLabel: rowStartHeaderLabels,
          // labels for above frozen column labels
          columnHeaderLabel: columnHeaderLabel,
          // row end values
          rowEndHeader: rowEndHeaderValues,
          // column end values
          columnEndHeader: columnEndHeaderValues,
          // row end labels
          rowEndHeaderLabel: rowEndHeaderLabel,
          // column end value labels
          columnEndHeaderLabel: columnEndHeaderLabel

        };
        // console.log(">>> fetchByOffset.results="+JSON.stringify(results, null, 2));
        setTimeout(() => {
          resolve(new this.FetchByOffsetGridResults(parameters, rowDone, columnDone, rowOffset, columnOffset, rowCount, columnCount, this.counts.row, this.counts.column, results, version, next));
        }, this.fetchDelay);
      });
    }


    getDatabodyResults(parameters, columnOffsetx, dataValues) {
      const rowOffset = parameters.rowOffset;
      const columnOffset = columnOffsetx;
      const rowCount = dataValues.length;
      const columnCount = (this.columnHeaderLabels).length;
      let dataArray = dataValues;
      let sortValue;
      if (this.getSortValue) {
        sortValue = this.getSortValue();
      }
      let databody;
      databody = [];
      this.mergeCells(false, dataValues, this.columnHeaderLabels, databody, 0, dataValues.length - 1, 0);
      return databody;
    }

    getHeaderResults(colEndHeaders) {
      let results = [];
      let index = 0;
      if (colEndHeaders !== undefined) {
        colEndHeaders.forEach(item => {
          let cell = new this.GridHeaderItem(index, 1, 0, 1, {}, { data: item });
          index++;
          results.push(cell);
        });
        return results;
      }
      else
        return undefined;
    };


    /**
     * This function merges header cells with same values. It does it per column from left to right.
     */
    mergeCells(headerCells, rowHeaders, rowHeadersHeaders, results, startRowIndex, endRowIndex, columnIndex) {
      // console.log(">>> mergeColumn: startRowIndex="+startRowIndex+" endRowIndex="+endRowIndex+" columnIndex="+columnIndex);
      // merge same values in given rows range and for given column 
      for (let rowIndex = startRowIndex; rowIndex < endRowIndex + 1; rowIndex++) {
        let value = rowHeaders[rowIndex][columnIndex];
        // find all next rows with the same column value
        let lastRowIndex = rowIndex;
        while (lastRowIndex < endRowIndex && rowHeaders[lastRowIndex + 1][columnIndex] === value) { lastRowIndex++ };
        // create cell for all these records
        let cell;
        if (headerCells) {
          cell = new this.GridHeaderItem(rowIndex, lastRowIndex - rowIndex + 1, columnIndex, 1, {}, { data: value });
        } else {
          cell = new this.GridBodyItem(lastRowIndex - rowIndex + 1, 1, rowIndex, columnIndex, {}, { data: value });
        }
        // console.log(">>> cell:" +JSON.stringify(cell, null, 2));
        results.push(cell);
        // for this new cell of merged rows [rowIndex...lastRowIndex] process next column
        // and merge the same values as well:
        if (rowHeadersHeaders !== undefined) {
          if (columnIndex + 1 < rowHeadersHeaders.length) {
            this.mergeCells(headerCells, rowHeaders, rowHeadersHeaders, results, rowIndex, lastRowIndex, columnIndex + 1);
          }
        }
        rowIndex = lastRowIndex;
      }
      return results;
    };

    getRowHeaderResults(rowHeaders, rowHeadersHeaders) {
      let results = [];
      // merge cells starting with first column and all rows:
      this.mergeCells(true, rowHeaders, rowHeadersHeaders, results, 0, rowHeaders.length - 1, 0);
      return results;
    }

    getCapability(capabilityName) {
      if (capabilityName === 'version') {
        return 'monotonicallyIncreasing';
      }
      return null;
    }
    isEmpty() {
      return (this.counts.row <= 0 || this.counts.column <= 0) ? 'yes' : 'no';
    }
  }
  ojeventtarget.EventTargetMixin.applyMixin(DemoDataGridProvider);
  return DemoDataGridProvider;
});