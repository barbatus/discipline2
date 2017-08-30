import moment from 'moment';

import 'moment-duration-format';

import { __ } from '../utils/format';

const SS_MS = 1000;
const MM_MS = 60 * SS_MS;
const HH_MS = 60 * 60 * SS_MS;

const time = {
  getDateMs() {
    const now = moment();
    return moment([
      now.year(), now.month(), now.date(),
    ]).valueOf();
  },

  getDateTimeMs() {
    return moment().valueOf();
  },

  formatTimeMs(timeMs) {
    const duration = moment.duration(timeMs);

    if (timeMs < MM_MS) {
      const ss = duration.seconds();
      const f = {
        hh: null,
        mm: '00',
        ss: __(ss),
        format: () => `00:${f.ss}`,
      };
      return f;
    }

    if (timeMs < HH_MS) {
      const ss = duration.seconds();
      const mm = duration.minutes();
      const f = {
        hh: null,
        mm: __(mm),
        ss: __(ss),
        format: () => `${f.mm}:${f.ss}`,
      };
      return f;
    }

    const ss = duration.seconds();
    const mm = duration.minutes();
    const hh = duration.hours();
    const f = {
      hh: ss,
      mm,
      ss,
      format: () => `${f.hh}:${f.mm}:${f.ss}`,
    };
    return f;
  },

  isSameDate(dateLike1, dateLike2) {
    const date1 = moment(dateLike1);
    const date2 = moment(dateLike2);

    return date1.isSame(date2, 'day');
  },

  getToDayEndMs() {
    const now = moment();
    const end = now.endOf('day');

    return end.diff(now, 'milliseconds');
  },

  getFromDayStartMs() {
    const now = moment();
    const start = now.startOf('day');

    return now.diff(start, 'milliseconds');
  },

  getCurMonthDateMs() {
    return moment().startOf('month').valueOf();
  },

  getNextMonthDateMs(dateMs) {
    return moment(dateMs)
      .startOf('month')
      .add(1, 'month')
      .startOf('month')
      .valueOf();
  },

  getPrevMonthDateMs(dateMs) {
    return moment(dateMs)
      .startOf('month')
      .subtract(1, 'month')
      .startOf('month')
      .valueOf();
  },

  addMonth(dateMs) {
    return moment(dateMs)
      .add(1, 'month')
      .endOf('month')
      .add(1, 'day')
      .valueOf();
  },

  subtractMonth(dateMs) {
    return moment(dateMs)
      .subtract(1, 'month')
      .startOf('month')
      .valueOf();
  },
};

module.exports = time;
