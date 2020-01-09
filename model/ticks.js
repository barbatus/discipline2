import groupBy from 'lodash/groupBy';
import moment from 'moment';

import { formatDistance } from 'app/utils/format';
import { TrackerType } from 'app/depot/consts';
import timeUtils from 'app/time/utils';

import { Tick, Tracker } from './Tracker';

export function tickValueFormatter(tracker: Tracker, metric: boolean) {
  switch (tracker.type) {
    case TrackerType.SUM:
      return (value: Number) => tracker.props.showBuck ? `$${value}` : value;
    case TrackerType.DISTANCE:
      return (value: Number) => {
        const distFmt = formatDistance(value, metric);
        return `${distFmt.format()}${distFmt.unit}`;
      };
    default:
      return (value) => value;
  }
}

export function combineTicksMonthly(ticks: Tick[], type: TrackerType, formatTickValue: (value: number) => string) {
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
      const dayTickPrints = groupTicksDaily(ticksDaily, type, formatTickValue);
      const total = dayTickPrints.reduce((accum, tick) => accum + tick.value, 0);
      const dayTicksPrint = {
        totalDesc: formatTickValue(total),
        ticks: groupTicksDaily(ticksDaily, type, formatTickValue),
      };
      return accum.set(day, dayTicksPrint);
    }, new Map());
    return map.set(month, dayMap);
  }, new Map());
}

export function groupTicksDaily(ticks: Tick[], type: TrackerType, formatTickValue: (value: number) => string) {
  const mins = groupBy(ticks, (tick) => tick.createdAt - (tick.createdAt % 60000));
  const tickPrints = Object.keys(mins).map((minKey) => {
    const minMs = parseInt(minKey, 10);
    const ticksMinly = mins[minKey];
    return printTick(ticksMinly, minMs, type, formatTickValue);
  });
  return tickPrints.filter((print) => !!print.value);
}

function printTick(ticks: Tick[], minMs: number, type: TrackerType, formatTickValue: (value: number) => string) {
  const timeDesc = moment(minMs).format('LT');
  switch (type) {
    case TrackerType.GOAL:
      return {
        longDesc: 'goal achieved',
        shortDesc: 'goal achieved',
        timeDesc,
        value: 1,
        createdAt: minMs,
      };
    case TrackerType.COUNTER: {
      const value = ticks.length;
      return {
        longDesc: `+ ${value} at ${timeDesc}`,
        shortDesc: `+ ${value}`,
        timeDesc,
        value,
        createdAt: minMs,
      };
    }
    case TrackerType.SUM: {
      const value = ticks.reduce((accum, tick) => accum + tick.value, 0);
      return {
        longDesc: `Added ${formatTickValue(value)} at ${timeDesc}`,
        shortDesc: `+ ${formatTickValue(value)}`,
        timeDesc,
        value,
        createdAt: minMs,
      };
    }
    case TrackerType.DISTANCE: {
      const value = ticks.reduce((accum, tick) => accum + tick.value, 0);
      const time = ticks.reduce((accum, tick) => accum + tick.time, 0);
      const paths = ticks.reduce((accum, tick) => {
        accum.push(tick.latlon);
        return accum;
      }, []);
      const timeFmt = timeUtils.formatTimeMs(time);
      const distDesc = formatTickValue(value);
      return {
        longDesc: `Tracked ${distDesc} starting at ${timeDesc}, duration ${timeFmt.format(false)}`,
        shortDesc: `${distDesc} in ${timeFmt.format(false)}`,
        timeDesc,
        value,
        time,
        paths,
        createdAt: minMs,
      };
    }
    case TrackerType.STOPWATCH: {
      const value = ticks.reduce((accum, tick) => accum + tick.value, 0);
      const timeFmt = timeUtils.formatTimeMs(value);
      return {
        longDesc: `Tracked ${timeFmt.format()} starting at ${timeDesc}`,
        shortDesc: timeFmt.format(),
        timeDesc,
        value,
        createdAt: minMs,
      };
    }
    default:
      throw new Error('Tracker type is not supported');
  }
}
