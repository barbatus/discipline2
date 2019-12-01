import { InteractionManager } from 'react-native';
import regression from 'regression';
import BackgroundFetch from 'react-native-background-fetch';

import Logger from 'app/log';
import time from 'app/time/utils';
import Interval from 'app/time/Interval';
import depot from 'app/depot/depot';

import PushNotification from './index';

export const MIN_TICKS_DIST_MS = 30 * 60 * 1000;

export const MIN_TICKS_AMOUNT = 5;

function checkIfTicksFit(ticks) {
  const dists = [];
  for (let i = 0; i < ticks.length - 1; i++) {
    dists.push(ticks[i + 1].createdAt - ticks[i].createdAt);
  }
  const validDists = dists.filter((dist) => dist >= MIN_TICKS_DIST_MS);
  return validDists.length >= MIN_TICKS_AMOUNT - 1;
}

function predictNext(ticks) { // Regression
  const dots = [];
  for (let i = 0; i < ticks.length - 1; i++) {
    dots.push([i + 1, ticks[i + 1].createdAt - ticks[i].createdAt]);
  }
  const result = regression.linear(dots);
  return result.predict(ticks.length)[1];
}

export async function evalAlerts(callback: Function) {
  const app = await depot.getApp();
  const tracksToNotify = app.trackers.filter((tracker) => tracker.props.alerts);
  tracksToNotify.forEach(async (tracker) => {
    const ticks = await depot.getLastTrackerTicks(tracker.id, MIN_TICKS_AMOUNT * 2);
    const lastTick = ticks[ticks.length - 1];
    const lastAlert = await depot.getLastAlert(tracker.id);

    if (lastTick && lastAlert && lastTick.createdAt <= lastAlert.createdAt) return;

    if (!checkIfTicksFit(ticks)) return;

    const nextDistMs = predictNext(ticks);
    const distToNow = Date.now() - (lastTick.createdAt + nextDistMs);
    if (distToNow < 0) return;

    let averageDist = 0;
    for (let i = 0; i < ticks.length - 1; i++) {
      averageDist += (ticks[i + 1].createdAt - ticks[i].createdAt);
    }
    averageDist /= (ticks.length - 1);
    try {
      await depot.addAlert(tracker.id, time.getNowMs());
      callback(tracker, averageDist);
    } catch (ex) {
      Logger.log(ex, { context: 'alerts:evalAlerts' });
    }
  });
}

export async function notify() {
  try {
    await PushNotification.configure();

    const app = await depot.getApp();
    if (!app.props.alerts) return;
    const showAlert = (tracker) => {
      const alertBody = `Usually you use this tracker every ${time.formatDurationMs(averageDist)}`;
      PushNotification.localNotification(`${tracker.title} Tracker`, alertBody);
    };
    InteractionManager.runAfterInteractions(evalAlerts.bind(this, showAlert));
  } catch (ex) {
    Logger.error(ex, { context: 'alerts:notify' });
  }
}

export function launchNotify() {
  BackgroundFetch.configure({
    minimumFetchInterval: 15, // minutes (15 is minimum allowed)
    // Android options
    stopOnTerminate: false,
    startOnBoot: true,
  }, async () => {
    await notify();
    BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
  }, (ex) => {
    Logger.error(ex, { context: 'RNBackgroundFetch.configure' });
  });

  BackgroundFetch.registerHeadlessTask(notify);
  BackgroundFetch.start();
}
