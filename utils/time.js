'user strict';

const moment = require('moment');

const time = {
  getDateMs: function() {
    let now = moment();
    let dateMs = moment([
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