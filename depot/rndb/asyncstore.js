'use strict';

var { AsyncStorage } = require('react-native');

var dbName = 'db_store';

var reactNativeStore = {
  createDataBase: async function() {
    var db = {};
    await AsyncStorage.setItem(dbName, JSON.stringify(db));
    return db;
  },

  saveTable: async function(tableName, tableData) {
    var db = await this.getItem(dbName);
    db[tableName] = tableData || {
      'totalrows': 0,
      'autoinc': 1,
      'rows': {}
    };
    await AsyncStorage.setItem(dbName, JSON.stringify(db));
    return db[tableName];
  },

  table: async function(tableName) {
    var db = await this.getItem(dbName);
    if (!db) {
      db = await this.createDataBase();
    }

    var tableData = db[tableName];
    if (!db[tableName]) {
      tableData = await this.saveTable(tableName);
    }

    return tableData;
  },

  getItem: async function(key) {
    var result = await AsyncStorage.getItem(key);
    return JSON.parse(result);
  }
}

module.exports = reactNativeStore;
