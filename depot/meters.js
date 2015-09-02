'use strict';

var RNDB = require('./db');

var table = new RNDB.create_table('meters');

var meters = {
  get_all: async function() {
    var rows = await table.get_all();
    return rows;
  },

  count: async function() {
    var rows = await table.get_all();
    return rows.length;
  },

  add: async function(meter) {
    await table.add(meter);
  }
};

module.exports = meters;
