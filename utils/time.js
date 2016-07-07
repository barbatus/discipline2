'user strict';

import moment from 'moment';
import 'moment-duration-format';

const time = {
  getDateMs: () => {
    let now = moment();
    let dateMs = moment([
      now.year(),
      now.month(),
      now.date()
    ]).valueOf();
    return dateMs;
  },

  getDateTimeMs: () => {
    return moment().valueOf();
  },

  formatTimeMs: (timeMs) => {
    let format = moment
      .duration(timeMs, 'ms')
      .format('hh:mm:ss');
    if (timeMs < 60000) {
      return `00:${format}`;
    }
    return format;
  }
};

module.exports = time;