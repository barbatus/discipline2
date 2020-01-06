import groupBy from 'lodash/groupBy';
import moment from 'moment';

import { formatDistance } from 'app/utils/format';
import { TrackerType } from 'app/depot/consts';
import timeUtils from 'app/time/utils';

import { Tick } from './Tracker';

export function combineTicksMonthly(ticks: Tick[], type: TrackerType, metric: boolean) {
  const months = groupBy(ticks, (tick) => {
    const tickDate = moment(tick.createdAt);
    return tickDate.month();
  });
  return Object.keys(months).reduce((map, monthKey) => {
    const month = parseInt(monthKey, 10);
    const ticksMonthly = months[monthKey];
    const days = groupBy(ticksMonthly, (tick) => {
      const tickDate = moment(tick.createdAt);
      return tickDate.date() - 1;
    });
    const dayMap = Object.keys(days).reduce((accum, dayKey) => {
      const day = parseInt(dayKey, 10);
      const ticksDaily = days[dayKey];
      return accum.set(day, combineTicksDaily(ticksDaily, type, metric));
    }, new Map());
    return map.set(month, dayMap);
  }, new Map());
}

export function combineTicksDaily(ticks: Tick[], type: TrackerType, metric: boolean) {
  const mins = groupBy(ticks, (tick) => tick.createdAt - (tick.createdAt % 60000),
  );
  const tickPrints = Object.keys(mins).map((minKey) => {
    const minMs = parseInt(minKey, 10);
    const ticksMinly = mins[minKey];
    return printTick(ticksMinly, minMs, type, metric);
  });
  return tickPrints.filter((print) => !!print.value);
}

function printTick(ticks: Tick[], minMs: number, type: TrackerType, metric: boolean) {
  switch (type) {
    case TrackerType.GOAL:
      return { desc: 'goal achieved', value: 1, createdAt: minMs, hasMore: false };
    case TrackerType.COUNTER: {
      const value = ticks.length;
      return { desc: `${value} added`, value, createdAt: minMs, hasMore: false };
    }
    case TrackerType.SUM: {
      const value = ticks.reduce((accum, tick) => accum + tick.value, 0);
      return { desc: `$${value} added`, value, createdAt: minMs, hasMore: false };
    }
    case TrackerType.DISTANCE: {
      const value = ticks.reduce((accum, tick) => accum + tick.value, 0);
      const time = ticks.reduce((accum, tick) => accum + tick.time, 0);
      const paths = ticks.reduce((accum, tick) => {
        accum.push(tick.latlon);
        return accum;
      }, []);
      const distFmt = formatDistance(value, metric);
      const timeFmt = timeUtils.formatTimeMs(time);
      return {
        desc: `${distFmt.format()}${distFmt.unit} in ${timeFmt.format(false)}`,
        value,
        time,
        paths,
        createdAt: minMs,
        hasMore: true,
      };
    }
    case TrackerType.STOPWATCH: {
      const value = ticks.reduce((accum, tick) => accum + tick.value, 0);
      const timeFmt = timeUtils.formatTimeMs(value);
      return { desc: `${timeFmt.format()} tracked`, value, createdAt: minMs, hasMore: false };
    }
    default:
      throw new Error('Tracker type is not supported');
  }
}
