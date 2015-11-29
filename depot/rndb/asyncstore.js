'use strict';

const { AsyncStorage } = require('react-native');

const dbName = 'db_store';

const reactNativeStore = {
  createDataBase: async function() {
    let db = {};
    await AsyncStorage.setItem(dbName, JSON.stringify(db));
    return db;
  },

  saveTable: async function(tableName, tableData) {
    let db = await this.getItem(dbName);
    db[tableName] = tableData || {
      'totalrows': 0,
      'autoinc': 1,
      'rows': []
    };
    await AsyncStorage.setItem(dbName, JSON.stringify(db));
    return db[tableName];
  },

  table: async function(tableName) {
    let db = await this.getItem(dbName);
    if (!db) db = await this.createDataBase();

    let tableData = db[tableName];
    if (!db[tableName]) {
      tableData = await this.saveTable(tableName);
    }

    return tableData;
  },

  getItem: async function(key) {
    let result = await AsyncStorage.getItem(key);
    return JSON.parse(result);
  }
}

module.exports = reactNativeStore;
