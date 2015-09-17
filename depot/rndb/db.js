'use strict';

var ReactNativeStore = require('./asyncstore');
var TableModel = require('./TableModel');

var Events = require('eventemitter3');
var events = new Events();

function table(tableName) {

  /**
   * @description Finds rows matching the query.
   * @param where
   */
  this.get = async function(where) {
    var dbTable = await ReactNativeStore.table(tableName);
    var table = new TableModel(dbTable);
    return table.where(where).find();
  };

  /**
   * @description Gets by ID.
   * @param rowId
   */
  this.get_id = async function(rowId) {
    var dbTable = await ReactNativeStore.table(tableName);
    var table = new TableModel(dbTable);
    return table.get(rowId);
  };

  /**
   * @description Gets all rows of the table.
   */
  this.get_all = async function() {
    var dbTable = await ReactNativeStore.table(tableName);
    var table = new TableModel(dbTable);
    return table.rows;
  };

  /**
   * @description Adds a row to the table.
   * @param newRow
   */
  this.add = async function(newRow) {
    var dbTable = await ReactNativeStore.table(tableName);
    var table = new TableModel(dbTable);
    var docId = table.add(newRow);
    await ReactNativeStore.saveTable(tableName, table.data);

    events.emit("all");
    return docId;
  };

  /**
   * @description Removes rows matching the query.
   * @param where
   */
  this.remove = async function(where) {
    var dbTable = await ReactNativeStore.table(tableName);
    var table = new TableModel(dbTable);
    var removedIds = table.where(where).remove();
    if (removedIds.length) {
      await ReactNativeStore.saveTable(tableName, table.data);
    }

    return removedIds; 
  };

  /**
   * @description Removes row by ID.
   * @param rowId
   */
  this.remove_id = async function(rowId) {
    var dbTable = await ReactNativeStore.table(tableName);
    var table = new TableModel(dbTable);
    var removed = table.removeById(rowId);
    if (removed) {
      await ReactNativeStore.saveTable(tableName, table.data);
    }

    events.emit('all');
    return removed;
  };

  /**
   * @description Erases DB.
   */
  this.erase_db = async function() {
    var dbTable = await ReactNativeStore.table(tableName);
    var table = new TableModel(dbTable);
    var removedIds = table.remove();
    await ReactNativeStore.saveTable(tableName, table.data);

    events.emit('all');
  }

  /**
   * @description Updates rows matching the query.
   * @param where
   * @param rowData
   */
  this.update = async function(where, rowData) {
    var dbTable = await ReactNativeStore.table(tableName);
    var table = new TableModel(dbTable);
    var updatedIds = table.where(where).update(rowData);
    if (updatedIds.length) {
      await ReactNativeStore.saveTable(tableName, table.data);
    }

    events.emit('all');
    return updatedIds;
  };

  /**
   * @description Updates row by ID.
   * @param rowId
   * @param rowData
   */
  this.update_id = async function(rowId, rowData) {
    var dbTable = await ReactNativeStore.table(tableName);
    var table = new TableModel(dbTable);
    var updated = table.updateById(rowId, rowData);
    if (updated) {
      await ReactNativeStore.saveTable(tableName, table.data);
    }

    events.emit('all');
    return updated;
  };

  /**
   * @description Removes row by ID.
   * @param rowId
   */
  this.remove_id = async function(rowId) {
    var dbTable = await ReactNativeStore.table(tableName);
    var table = new TableModel(dbTable);
    var removed = table.removeById(rowId);
    if (removed) {
      await ReactNativeStore.saveTable(tableName, table.data);
    }

    events.emit('all');
    return removed;
  };
};

var db = {
  create_table: function(name) {
    return new table(name);
  }
};

module.exports = db;
