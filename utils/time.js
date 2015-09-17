'user strict';

var moment = require('moment');

var time = {
  getDateMs: function() {
    var now = moment();
    var dateMs = moment([
      now.year(),
      now.month(),
      now.date()
    ]).valueOf();
    return dateMs;
  },

  getDateTimeMs: function() {
    return moment().valueOf();
  }
};

module.exports = time;