'use strict';

var ReactNativeStore = require('./asyncstore');
var Events = require('eventemitter3')
var RNDB = {};
RNDB.DBEvents = new Events();

RNDB.create_table = function(name) {
  this.table_name = name;

  /**
   * @description Finds rows matching the query.
   * @param where
   */
  this.get = async function(where) {
    var table = await ReactNativeStore.table(this.table_name)
    return table.where(where).find();
  };

  /**
   * @description Gets by ID.
   * @param rowId
   */
  this.get_id = async function(rowId) {
    var table = await ReactNativeStore.table(this.table_name);
    return table.get(rowId);
  };

  /**
   * @description Gets all rows of the table.
   */
  this.get_all = async function() {
    var table = await ReactNativeStore.table(this.table_name);
    return table.rows;
  };

  /**
   * @description Adds a row to the table.
   * @param newRow
   */
  this.add = async function(newRow) {
    var table = await ReactNativeStore.table(this.table_name);
    var docId = await table.add(newRow);
    RNDB.DBEvents.emit("all");
    return docId;
  };

  /**
   * @description Removes rows matching the query.
   * @param where
   */
  this.remove = async function(where) {
    var table = await ReactNativeStore.table(this.table_name);
    return await table.where(where).remove(); 
  };

  /**
   * @description Removes row by ID.
   * @param rowId
   */
  this.remove_id = async function(rowId) {
    var table = await ReactNativeStore.table(this.table_name);
    await table.removeById(rowId);
    RNDB.DBEvents.emit('all');
    return true;
  };

  /**
   * @description Erases DB.
   */
  this.erase_db = async function() {
    var table = await ReactNativeStore.table(this.table_name);
    var ids = await table.remove();
    RNDB.DBEvents.emit('all');
    return ids;
  }

  /**
   * @description Updates rows matching the query.
   * @param where
   * @param rowData
   */
  this.update = async function(where, rowData) {
    var table = await ReactNativeStore.table(this.table_name);
    await table.where(where).update(rowData);
    RNDB.DBEvents.emit('all');
  };

  /**
   * @description Updates row by ID.
   * @param rowId
   * @param rowData
   */
  this.update_id = async function(rowId, rowData) {
    var table = await ReactNativeStore.table(this.table_name);
    await table.updateById(rowId, rowData);
    RNDB.DBEvents.emit('all');
  };

  /**
   * @description Removes row by ID.
   * @param rowId
   */
  this.remove_id = async function(rowId) {
    var table = await ReactNativeStore.table(this.table_name);
    await table.removeById(rowId);
    RNDB.DBEvents.emit('all');
  };
};

module.exports = RNDB;
