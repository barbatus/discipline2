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
    return this._data['rows'];
  }

  get lastRow() {
    return _.last(this._data['rows']);
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

  _scanRows(where) {
    let rows = [], indice = [];
    this.rows.forEach((row, index) => {
      for (let key in where) {
        if (row[key] != where[key]) {
          return;
        }
      }
      indice.push(index);
      rows.push(row);
    });

    return { rows, indice };
  }

  update(rowData) {
    let updatedIds = [];
    if (this._where) {
      let { rows } = this._scanRows(this._where);
      rows.forEach(row => {
        for (let prop in rowData) {
          row[prop] = rowData[prop];
        }
        updatedIds.push(row._id);
      })
    }

    this.reset();

    return updatedIds;
  }

  updateById(rowId, rowData) {
    let removedIds = this.where({ _id: rowId }).update(rowData);
    return removedIds.length != 0;
  }

  remove() {
    let removeInd = [];
    if (this._where) {
      let { indice } = this._scanRows(this._where);
      removeInd = indice.reverse();
    } else {
      let indice = _.range(this.rows.length);
      removeInd = indice.reverse();
    }

    let removedIds = [];
    //for (let index of removeInd) {
      removeInd.forEach(index => {
        removedIds.push(this.rows[index]._id);
        this.rows.splice(index, 1);
      });
    //}

    this.reset();

    return removedIds;
  }

  _removeRow(rowId) {
    delete this._data[rowId];
    this._data['totalrows']--;
  }

  removeById(rowId) {
    let removedIds = this.where({ _id: rowId }).remove();
    return removedIds.length !== 0;
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
      let { rows } = this._scanRows(this._where);
      result = rows;
    } else {
      let rows = this.rows.slice();
      result = rows;
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
