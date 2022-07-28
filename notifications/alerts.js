import { InteractionManager } from 'react-native';
import regression from 'regression';
import BackgroundFetch from 'react-native-background-fetch';
import moment from 'moment';

import Logger from 'app/log';
import time from 'app/time/utils';
import depot from 'app/depot/depot';
import { FreqType } from 'app/depot/consts';

import PushNotification from './index';

const dayRange = [8 * 3600 * 1000, 22 * 3600 * 1000];
const dayDiffMs = dayRange[1] - dayRange[0];

function snapToRange(timeMs) {
  const dayTime = time.getFromDayStartMs(timeMs);
  if (dayTime <= dayRange[0]) {
    return dayRange[0];
  }
  if (dayTime >= dayRange[1]) {
    return dayRange[1];
  }
  return timeMs;
}

async function evalHours(trackId) {
  const ticks = await depot.getTicks(trackId, time.getDateMs());
  if (!ticks.length) {
    return [time.getFromDayStartMs() - dayRange[0], time.getDateMs() + dayRange[0]];
  }

  const lastTick = ticks[ticks.length - 1];
  const diff = Date.now() - lastTick.createdAt;
  return [diff, lastTick.createdAt];
}

async function evalDays(trackId, startDayMs) {
  const ticks = await depot.getTicks(trackId, startDayMs);
  const lastDateMs = ticks.length ? ticks[ticks.length - 1].createdAt : startDayMs;
  const lastDate = moment(lastDateMs);
  const dayDiff = Math.max(0, moment().date() - lastDate.date() - 1);

  if (dayDiff === 0) {
    return [Date.now() - lastDateMs, lastDateMs];
  }

  const diff = dayDiff * dayDiffMs +
    (dayRange[1] - snapToRange(lastDate.valueOf())) + (snapToRange(Date.now()) - dayRange[0]);
  return [diff, lastDateMs];
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
    let curDistMs = null;
    let maxDistMs = null;
    let lastTickMs = null;
    switch (p) {
      case FreqType.DAILY.valueOf():
        maxDistMs = Math.ceil(dayDiffMs / times); 
        [curDistMs, lastTickMs] = await evalHours(tracker.id);
        break;
      case FreqType.WEEKLY.valueOf():
        maxDistMs = Math.ceil(7 * dayDiffMs / times);
        [curDistMs, lastTickMs] = await evalDays(tracker.id, time.getCurWeekDateMs());
        break;
      case FreqType.MONTHLY.valueOf():
        maxDistMs = Math.ceil(30 * dayDiffMs / times);
        [curDistMs, lastTickMs] = await evalDays(tracker.id,  time.getCurMonthDateMs());
        break;
      default:
        Logger.error(`Invalid freq value: ${freq}`);
        return;
    }

    Logger.log(`Tracker ${tracker.title} stats:
      every ${time.formatDurationMs(maxDistMs)}, current distance ${time.formatDurationMs(curDistMs)}`, {
      context: '[evalAlerts]',
    });

    const lastAlert = await depot.getLastAlert(tracker.id);
    if (lastAlert && lastTickMs &&
        lastAlert.createdAt >= lastTickMs &&
        lastAlert.createdAt - lastTickMs < maxDistMs) {
      Logger.log(`Tracker ${tracker.title}: already notified`, {
        context: '[evalAlerts]',
      });
      return;
    }

    if (curDistMs < maxDistMs) {return;}

    try {
      const lastTick = await depot.getLastTick();
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
      const fromNow = lastTickMs ? moment(lastTickMs).fromNow() : '';
      const alertBody = `Time to track ${tracker.title}? Last time you did it ${fromNow}`;
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
