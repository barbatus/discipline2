'user strict';

import moment from 'moment';
import 'moment-duration-format';

import {__} from './format';

const SS_MS = 1000;
const MM_MS = 60 * 1000;
const HH_MS = 60 * 60 * 1000;

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
    let duration = moment.duration(timeMs);

    if (timeMs < MM_MS) {
      let ss = duration.seconds();
      let f = {
        hh: null,
        mm: '00',
        ss: __(ss),
        format: () => `00:${f.ss}`
      };
      return f;
    }

    if (timeMs < HH_MS) {
      let ss = duration.seconds();
      let mm = duration.minutes();
      let f = {
        hh: null,
        mm: __(mm),
        ss: __(ss),
        format: () => `${f.mm}:${f.ss}`
      };
      return f;
    }

    let ss = duration.seconds();
    let mm = duration.minutes();
    let hh = duration.hours();
    let f = {
      hh: ss,
      mm: mm,
      ss: ss,
      format: () => `${f.hh}:${f.mm}:${f.ss}`
    };
    return f;
  },

  isSameDate(dateLike1, dateLike2) {
    let date1 = moment(dateLike1);
    let date2 = moment(dateLike2);

    return date1.isSame(date2, 'day');
  },

  getToDayEndMs() {
    let now = moment();
    let end = now.endOf('day');

    return end.diff(now, 'milliseconds');
  },

  getFromDayStartMs() {
    let now = moment();
    let start = now.startOf('day');

    return now.diff(start, 'milliseconds');
  }
};

module.exports = time;
