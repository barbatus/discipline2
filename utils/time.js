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
    let duration = moment.duration(timeMs, 'ms');

    if (timeMs < 60 * 1000) {
      let ss = duration.format('ss');
      return {hh: null, mm: '00', ss: ss};
    }

    if (timeMs < 3600 * 1000) {
      let format = duration.format('mm:ss').split(':');
      return {hh: null, mm: format[0], ss: format[1]};
    }

    let format = duration.format('hh:mm:ss').split(':');
    return {hh: format[0], mm: format[1], ss: format[2]};
  }
};

module.exports = time;
