'use strict';

const reactNativeStore = require('./asyncstore');

class TableModel {
  constructor(tableData) {
    this._data = tableData;
    this._where = undefined;
    this._limit = undefined;
    this._offset = 0;
  }

  get data() {
    return this._data;
  }

  get rows() {
    // var rows = [];
    // for (var row in this._data['rows']) {
    //   rows.push(this._data['rows'][row]);
    // }
    return this._data['rows'];
  }

  where(where) {
    this._where = where;
    return this;
  }

  limit(limit) {
    this._limit = limit;
    return this;
  }

  offset(offset) {
    this._offset = offset;
    return this;
  }

  reset() {
    this._where = undefined;
    this._limit = undefined;
    this._offset = 0;
    return this;
  }

  update(rowData) {
    let updatedIds = [];
    if (this._where) {
      for (let row of this.rows) {
        let isMatch = true;
        for (let key in this._where) {
          if (row[key] != this._where[key]) {
            isMatch = false;
            break;
          }
        }
        if (isMatch) {
          for (let prop in rowData) {
            row[prop] = rowData[prop];
          }
          updatedIds.push(row._id);
        }
      }
    }
    this.reset();
    return updatedIds;
  }

  updateById(rowId, rowData) {
    var removedIds = this.where({ _id: rowId }).update(rowData);
    return removedIds.length != 0;
  }

  remove() {
    var removedIds = [];
    if (this._where) {
      for (var row of this.rows) {
        var isMatch = true;
        for (var key in this._where) {
          if (row[key] != this._where[key]) {
            isMatch = false;
            break;
          }
        }
        if (isMatch) {
          delete this._data[row._id];
          this._data['totalrows']--;
          removedIds.push(row._id);
        }
      }
    } else {
      for (var row of this.rows) {
        delete this._data[row._id];
        this._data['totalrows']--;
        removedIds.push(row._id);
      }
    }
    this.reset();
    return removedIds;
  };

  removeById(rowId) {
    var removedIds = this.where({ _id: rowId }).remove();
    return removedIds.length != 0;
  }

  add(newRow) {
    return this.addAt(newRow);
  }

  addAt(newRow, opt_index) {
    let autoinc = this._data.autoinc;
    newRow._id = autoinc;
    let nextIndex = _.isUndefined(opt_index) ? 
      this._data.rows.length : opt_index;
    this._data.rows.splice(nextIndex, 0, newRow);
    this._data.autoinc += 1;
    this._data.totalrows += 1;
    return autoinc;
  }

  get(rowId) {
    return this.where({ _id: rowId }).find()[0];
  }

  find() {
    let result = [];
    if (this._where) {
      for (let row of this.rows) {
        let isMatch = true;
        for (let key in this._where) {
          if (row[key] != this._where[key]) {
            isMatch = false;
            break;
          }
        }
        if (isMatch) {
          result.push(row);
        }
      }
    } else {
      for (let row of rows) {
        result.push(row);
      }
    }

    if (_.isNumber(this._limit)) {
      result = result.slice(this._offset,
        this._limit + this._offset);
    }

    this.reset();

    return result;
  }
}

module.exports = TableModel;
