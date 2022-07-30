import moment from 'moment';
import 'moment-duration-format';

import { padZero } from '../utils/format';

const SS_MS = 1000;
const MM_MS = 60 * SS_MS;
const HH_MS = 60 * 60 * SS_MS;
const DAY_MS = 24 * 60 * 60 * SS_MS;

const time = {
  getDateMs() {
    const now = moment();
    return moment([
      now.year(), now.month(), now.date(),
    ]).valueOf();
  },

  getYestMs() {
    const yest = moment().subtract(1, 'days');
    return moment([
      yest.year(), yest.month(), yest.date(),
    ]).valueOf();
  },

  getNowMs() {
    return moment().valueOf();
  },

  formatTimeMs(timeMs) {
    const duration = moment.duration(timeMs);

    if (timeMs < MM_MS) {
      const ss = duration.seconds();
      const f = {
        hh: null,
        mm: '00',
        ss: padZero(ss),
        format: (full = true) => full ? `00:${f.ss}s` : `${f.ss}s`,
      };
      return f;
    }

    if (timeMs < HH_MS) {
      const ss = duration.seconds();
      const mm = duration.minutes();
      const f = {
        hh: null,
        mm: padZero(mm),
        ss: padZero(ss),
        format: () => `${f.mm}:${f.ss}min`,
      };
      return f;
    }

    const ss = duration.seconds();
    const mm = duration.minutes();
    const hh = duration.hours() + 24 * duration.days();
    const f = {
      hh: padZero(hh),
      mm: padZero(mm),
      ss: padZero(ss),
      format: () => `${f.hh}:${f.mm}:${f.ss}h`,
    };
    return f;
  },

  formatDurationMs(durMs): string {
    const roundedMs = Math.round(durMs / (MM_MS * 10)) * (MM_MS * 10);

    if (roundedMs < HH_MS) {
      const mm = Math.round(roundedMs / MM_MS);
      return `${mm} minutes`;
    }

    if (roundedMs < DAY_MS) {
      const hh = Math.round(roundedMs / HH_MS);
      const unit = hh > 1 ? 'hours' : 'hour';
      return `${hh} ${unit}`;
    }

    const dd = Math.round(roundedMs / DAY_MS);
    const unit = dd > 1 ? 'days' : 'day';
    return `${dd} ${unit}`;
  },

  isSameDate(dateLike1, dateLike2) {
    const date1 = moment(dateLike1);
    const date2 = moment(dateLike2);

    return date1.isSame(date2, 'day');
  },

  getToEndDayMs() {
    const now = moment();
    const end = moment().endOf('day');

    return end.diff(now, 'ms');
  },

  getFromDayStartMs(at) {
    const now = moment(at);
    const start = moment().startOf('day');

    return now.diff(start, 'ms');
  },

  getCurMonthDateMs() {
    return moment().startOf('month').valueOf();
  },

  getCurWeekDateMs() {
    return moment().startOf('week').valueOf();
  },

  getPrevWeekDateMs(dateMs) {
    return moment(dateMs)
      .startOf('week')
      .subtract(1, 'week')
      .startOf('week')
      .valueOf();
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

export default time;
