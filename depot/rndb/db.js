'use strict';

const ReactNativeStore = require('./asyncstore');
const TableModel = require('./TableModel');

const Events = require('eventemitter3');
let events = new Events();

function DbTable(tableName) {
  this.get = async function(where) {
    let dbTable = await ReactNativeStore.table(tableName);
    let table = new TableModel(dbTable);
    return table.where(where).find();
  };

  this.getId = async function(rowId) {
    let dbTable = await ReactNativeStore.table(tableName);
    let table = new TableModel(dbTable);
    return table.get(rowId);
  };

  this.getAll = async function() {
    let dbTable = await ReactNativeStore.table(tableName);
    let table = new TableModel(dbTable);
    return table.rows;
  };

  this.getLast = async function() {
    let dbTable = await ReactNativeStore.table(tableName);
    let table = new TableModel(dbTable);
    return table.lastRow;
  };

  this.add = async function(newRow) {
    return await this.addAt(newRow);
  };

  this.addAt = async function(newRow, opt_index) {
    let dbTable = await ReactNativeStore.table(tableName);
    let table = new TableModel(dbTable);
    let docId = table.addAt(newRow, opt_index);
    await ReactNativeStore.saveTable(tableName, table.data);

    events.emit('all');
    return docId;
  };

  this.remove = async function(where) {
    let dbTable = await ReactNativeStore.table(tableName);
    let table = new TableModel(dbTable);

    let removedIds = table.where(where).remove();
    if (removedIds.length) {
      await ReactNativeStore.saveTable(tableName, table.data);
    }

    return removedIds; 
  };

  this.removeById = async function(rowId) {
    let dbTable = await ReactNativeStore.table(tableName);
    let table = new TableModel(dbTable);

    let removed = table.removeById(rowId);
    if (removed) {
      await ReactNativeStore.saveTable(tableName, table.data);
    }

    events.emit('all');
    return removed;
  };

  this.update = async function(where, rowData) {
    let dbTable = await ReactNativeStore.table(tableName);
    let table = new TableModel(dbTable);
    let updatedIds = table.where(where).update(rowData);

    if (updatedIds.length) {
      await ReactNativeStore.saveTable(tableName, table.data);
    }

    events.emit('all');
    return updatedIds;
  };

  this.updateById = async function(rowId, rowData) {
    let dbTable = await ReactNativeStore.table(tableName);
    let table = new TableModel(dbTable);

    let updated = table.updateById(rowId, rowData);
    if (updated) {
      await ReactNativeStore.saveTable(tableName, table.data);
    }

    events.emit('all');
    return updated;
  };

  this.erase = async function() {
    let dbTable = await ReactNativeStore.table(tableName);
    let table = new TableModel(dbTable);
    let removedIds = table.remove();
    await ReactNativeStore.saveTable(tableName, table.data);

    events.emit('all');
  }
};

let db = {
  createTable: function(name) {
    return new DbTable(name);
  },
  getTable: function(name) {
    return new DbTable(name);
  }
};

module.exports = db;
