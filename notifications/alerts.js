import { InteractionManager } from 'react-native';
import regression from 'regression';
import BackgroundFetch from 'react-native-background-fetch';
import moment from 'moment';

import Logger from 'app/log';
import time from 'app/time/utils';
import depot from 'app/depot/depot';
import { FreqType } from 'app/depot/consts';

import PushNotification from './index';

// Define a day as 8AM - 10PM for simplicity.
const dayRange = [8 * 3600 * 1000, 22 * 3600 * 1000];
const dayDiffMs = dayRange[1] - dayRange[0];
const days = {
  [FreqType.DAILY.valueOf()]: 1,
  [FreqType.WEEKLY.valueOf()]: 7,
  [FreqType.MONTHLY.valueOf()]: 30,
};

function snapToRange(timeMs) {
  const dayTime = time.getFromDayStartMs(timeMs);
  const dayStartMs = moment(timeMs).startOf('day').valueOf();
  if (dayTime <= dayRange[0]) {
    return dayStartMs + dayRange[0];
  }
  if (dayTime >= dayRange[1]) {
    return dayStartMs + dayRange[1];
  }
  return timeMs;
}

function calcDist(curMs, prevMs) {
  const dayDiff = Math.max(0, moment(curMs).date() - moment(prevMs).date() - 1);
  if (dayDiff === 0) {
    return snapToRange(curMs) - snapToRange(prevMs);
  }
  const diff = dayDiff * dayDiffMs +
    ((time.getDateMs() + dayRange[1]) - snapToRange(prevMs)) +
    (snapToRange(curMs) - (time.getDateMs() + dayRange[0]));
  return diff;
}

async function evalDiff(trackId, prevStartMs, curStartMs) {
  const ticks = await depot.getTicks(trackId, curStartMs);
  const prevTicks = await depot.getTicks(trackId, prevStartMs, curStartMs);
  const dayStartMs = moment().startOf('day');
  const lastDateMs = snapToRange(ticks.length ? ticks[ticks.length - 1].createdAt : curStartMs);
  const dayDiff = Math.max(0, moment().date() - moment(lastDateMs).date() - 1);

  if (dayDiff === 0) {
    return [Date.now() - lastDateMs, Boolean(prevTicks.length), Boolean(ticks.length), lastDateMs];
  }

  const diff = dayDiff * dayDiffMs +
    ((time.getDateMs() + dayRange[1]) - lastDateMs) +
    (snapToRange(Date.now()) - (time.getDateMs() + dayRange[0]));
  return [diff, Boolean(prevTicks.length), Boolean(ticks.length), lastDateMs];
}

export async function evalAlerts(callback: Function) {
  const app = await depot.getApp();
  const tracksToNotify = app.trackers.filter((tracker) =>
    tracker.props.alerts && tracker.props.freq);
  tracksToNotify.forEach(async (tracker) => {
    const freq = tracker.props.freq;
    const parsedFreq = /^(\d+)(d|w|m)$/.exec(freq);
    if (!parsedFreq) {
      Logger.error(`Invalid freq value: ${freq}`);
      return;
    }

    const [_, c, p] = parsedFreq;
    const times = parseInt(c, 10);
    let maxDistMs = Math.ceil(days[p] * dayDiffMs / times);
    let curDistMs = null;
    let lastTickMs = null;
    let hasTicksCurPeriod = true;
    let hasTicksLastPeriod = true;
    switch (p) {
      case FreqType.DAILY.valueOf():
        [curDistMs, hasTicksLastPeriod, hasTicksCurPeriod, lastTickMs] = await evalDiff(tracker.id,
            time.getYestMs(), time.getDateMs());
        break;
      case FreqType.WEEKLY.valueOf():
        [curDistMs, hasTicksLastPeriod, hasTicksCurPeriod, lastTickMs] = await evalDiff(tracker.id,
          time.getPrevWeekDateMs(), time.getCurWeekDateMs());
        break;
      case FreqType.MONTHLY.valueOf():
        [curDistMs, hasTicksLastPeriod, hasTicksCurPeriod, lastTickMs] = await evalDiff(tracker.id,
          time.getPrevMonthDateMs(), time.getCurMonthDateMs());
        break;
      default:
        Logger.error(`Invalid freq value: ${freq}`);
        return;
    }

    Logger.log(`Tracker ${tracker.title} stats:
      every ${time.formatDurationMs(maxDistMs)}, current distance ${time.formatDurationMs(curDistMs)}`, {
      context: '[evalAlerts]',
    });

    // If there is lastAlert and distance to Now does not exceed maxDistMs
    // then skip alerting again.
    const lastAlert = await depot.getLastAlert(tracker.id);
    if (lastAlert && calcDist(Date.now(), lastAlert.createdAt) < maxDistMs) {
      Logger.log(`Tracker ${tracker.title}: already notified`, {
        context: '[evalAlerts]',
      });
      return;
    }

    if (curDistMs < maxDistMs && (hasTicksCurPeriod || hasTicksLastPeriod)) {return;}

    try {
      const lastTick = await depot.getLastTick(tracker.id);
      await depot.addAlert(tracker.id, time.getNowMs());
      callback(tracker, lastTick?.createdAt);
    } catch (ex) {
      Logger.log(ex, { context: 'evalAlerts' });
    }
  });
}

export async function notify() {
  try {
    await PushNotification.configure();

    const app = await depot.getApp();
    if (!app.props.alerts) {return;}

    const showAlert = (tracker, lastTickMs) => {
      const fromNow = lastTickMs ? `Last time you did it ${moment(lastTickMs).fromNow()}` : '';
      const alertBody = `Time to track ${tracker.title}? ` + fromNow;
      PushNotification.localNotification(`Tracker ${tracker.title}`, alertBody);
    };
    InteractionManager.runAfterInteractions(() => {
      evalAlerts(showAlert);
      Logger.log('Alerts evaluated');
    });
  } catch (ex) {
    Logger.error(ex, { context: 'alerts:notify' });
  }
}
