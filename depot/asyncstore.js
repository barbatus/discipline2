'use strict';

var React = require('react-native');
var Promise = require('promise');

var AsyncStorage = React.AsyncStorage;

var reactNativeStore = {};
var dbName = "db_store";

reactNativeStore.createDataBase = async function() {
  var db = {};
  await AsyncStorage.setItem(dbName, JSON.stringify(db));
  return db;
};

reactNativeStore.saveTable = async function(tableName, tableData) {
  var db = await this.getItem(dbName);
  db[tableName] = tableData || {
    'totalrows': 0,
    'autoinc': 1,
    'rows': {}
  };
  await AsyncStorage.setItem(dbName, JSON.stringify(db));
  return db[tableName];
};

reactNativeStore.table = async function(tableName) {
  var db = await this.getItem(dbName);
  if (!db) {
    db = await this.createDataBase();
  }

  var tableData = db[tableName];
  if (!db[tableName]) {
    tableData = await this.saveTable(tableName);
  }

  var table = new Table(tableName, tableData);
  return table;
};

reactNativeStore.getItem = async function(key) {
  var result = await AsyncStorage.getItem(key);
  return JSON.parse(result);
};

class Table {
  constructor(tableName, tableData) {
    this.tableName = tableName;
    this.tableData = tableData;
    this._where = null;
    this._limit = 100;
    this._offset = 0;
    return this;
  }

  where(where) {
    this._where = where || null;
    return this;
  }

  limit(limit) {
    this._limit = limit || 100;
    return this;
  }

  offset(offset) {
    this._offset = offset || 0;
    return this;
  }

  reset() {
    this.where();
    this.limit();
    this.offset();
    return this;
  }

  get rows() {
    var rows = [];
    for (var row in this.tableData['rows']) {
      rows.push(this.tableData['rows'][row]);
    }
    return rows;
  }

  async update(rowData) {
    var hasWhere = false;
    if (this._where) {
      hasWhere = true;
    }
    if (hasWhere) {
      for (var row of this.rows) {
        var isMatch = true;
        for (var key in this._where) {
          if (row[key] != this._where[key]) {
            isMatch = false;
            break;
          }
        }
        if (isMatch) {
          for (var prop in rowData) {
            row[prop] = rowData[prop];
          }
        }
      }
      await reactNativeStore.saveTable(this.tableName, this.tableData);
      this.reset();
    }
  }

  async updateById(rowId, rowData) {
    this.where({
      _id: rowId
    });
    return this.update(rowData);
  }

  async remove() {
    var removedIds = [];
    var hasWhere = false;
    if (this._where) {
      hasWhere = true;
    }
    if (hasWhere) {
      for (var row of this.rows) {
        var isMatch = true;
        for (var key in this._where) {
          if (row[key] != this._where[key]) {
            isMatch = false;
            break;
          }
        }
        if (isMatch) {
          removedIds.push(row._id);
          delete this.tableData[row._id];
          this.tableData['totalrows']--;
        }
      }
    } else {
      for (var row of this.rows) {
        removedIds.push(row._id);
        delete this.tableData[row._id];
        this.tableData['totalrows']--;
      }
    }
    this.reset();

    if (removedIds.length) {
      await reactNativeStore.saveTable(this.tableName, this.tableData);
      return removedIds;
    }
    return [];
  };

  async removeById(rowId) {
    this.where({
      _id: rowId
    });
    return await this.remove();
  }

  async add(newRow) {
    var autoinc = this.tableData.autoinc;
    newRow._id = autoinc;
    this.tableData.rows[autoinc] = newRow;
    this.tableData.autoinc += 1;
    this.tableData.totalrows += 1;
    await reactNativeStore.saveTable(this.tableName, this.tableData);

    return autoinc;
  }

  get(rowId) {
    this.where({
      _id: rowId
    });
    return this.find(1);
  }

  find() {
    var result = [];
    var hasWhere = false;
    if (this._where) {
      hasWhere = true;
    }
    if (hasWhere) {
      for (var row of this.rows) {
        var isMatch = true;
        for (var key in this._where) {
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
      for (var row of rows) {
        result.push(row);
      }
    }
    this.reset();

    if (typeof(this._limit) == 'number') {
      return result.slice(this._offset, this._limit + this._offset);
    }
    return result;
  }
}

module.exports = reactNativeStore;
