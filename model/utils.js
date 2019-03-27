import groupBy from 'lodash/groupBy';
import moment from 'moment';

import { formatDistance } from 'app/utils/format';
import { TrackerType } from 'app/depot/consts';
import timeUtils from 'app/time/utils';

import { Tick } from './Tracker';

export function combineTicksMonthly(ticks: Tick[], type: TrackerType) {
  const months = groupBy(ticks, (tick) => {
    const tickDate = moment(tick.dateTimeMs);
    return tickDate.month();
  });
  return Object.keys(months).reduce((map, monthKey) => {
    const month = parseInt(monthKey, 10);
    const ticksMonthly = months[monthKey];
    const days = groupBy(ticksMonthly, (tick) => {
      const tickDate = moment(tick.dateTimeMs);
      return tickDate.date() - 1;
    });
    const dayMap = Object.keys(days).reduce((accum, dayKey) => {
      const day = parseInt(dayKey, 10);
      const ticksDaily = days[dayKey];
      return accum.set(day, combineTicksDaily(ticksDaily, type));
    }, new Map());
    return map.set(month, dayMap);
  }, new Map());
}

export function combineTicksDaily(ticks: Tick[], type: TrackerType) {
  const mins = groupBy(ticks, (tick) => tick.dateTimeMs - (tick.dateTimeMs % 60000),
  );
  const tickPrints = Object.keys(mins).map((minKey) => {
    const minMs = parseInt(minKey, 10);
    const ticksMinly = mins[minKey];
    return printTick(ticksMinly, minMs, type);
  });
  return tickPrints.filter((print) => !!print.value);
}

function printTick(ticks: Tick[], minMs: number, type: TrackerType) {
  switch (type) {
    case TrackerType.GOAL:
      return { desc: 'the goal is achieved', value: 1, dateTimeMs: minMs };
    case TrackerType.COUNTER: {
      const value = ticks.length;
      const times = value > 1 ? 'times' : 'time';
      return { desc: `increased ${value} ${times}`, value, dateTimeMs: minMs };
    }
    case TrackerType.SUM: {
      const value = ticks.reduce((accum, tick) => accum + tick.value, 0);
      return { desc: `$${value} added`, value, dateTimeMs: minMs };
    }
    case TrackerType.DISTANCE: {
      const value = ticks.reduce((accum, tick) => accum + tick.value, 0);
      const time = ticks.reduce((accum, tick) => accum + tick.time, 0);
      const paths = ticks.reduce((accum, tick) => {
        accum.push(tick.latlon);
        return accum;
      }, []);
      const distFmt = formatDistance(value);
      const timeFmt = timeUtils.formatTimeMs(time);
      return {
        desc: `${distFmt.format()}${distFmt.unit} in ${timeFmt.format(false)}`,
        value,
        time,
        paths,
        dateTimeMs: minMs,
      };
    }
    case TrackerType.STOPWATCH: {
      const value = ticks.reduce((accum, tick) => accum + tick.value, 0);
      const timeFmt = timeUtils.formatTimeMs(value);
      return { desc: `${timeFmt.format()} tracked`, value, dateTimeMs: minMs };
    }
    default:
      throw new Error('Tracker type is not supported');
  }
}
