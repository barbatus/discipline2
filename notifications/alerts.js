import { InteractionManager } from 'react-native';
import regression from 'regression';
import BackgroundFetch from 'react-native-background-fetch';

import Logger from 'app/log';
import time from 'app/time/utils';
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
    const lastAlert = await depot.getLastAlert(tracker.id);
    const ticks = await depot.getLastTrackerTicks(tracker.id, MIN_TICKS_AMOUNT * 3);
    const lastTick = ticks[ticks.length - 1];

    if (lastAlert && lastTick && lastAlert.createdAt >= lastTick.createdAt) return;

    if (!checkIfTicksFit(ticks)) {
      Logger.log(`Tracker ${tracker.title}: not enough ticks for an alert`, {
        context: '[evalAlerts:checkIfTicksFit]',
      });
      return;
    };

    const nextDistMs = predictNext(ticks);
    const distToNow = Date.now() - (lastTick.createdAt + nextDistMs);
    if (distToNow < 0) {
      Logger.log(`New tick in ${time.formatDurationMs(nextDistMs)} for ${tracker.title}`, {
        context: '[evalAlerts:predictNext]',
      });
      return;
    }

    try {
      await depot.addAlert(tracker.id, time.getNowMs());
      callback(tracker, nextDistMs);
    } catch (ex) {
      Logger.log(ex, { context: 'evalAlerts' });
    }
  });
}

export async function notify() {
  try {
    await PushNotification.configure();

    const app = await depot.getApp();
    if (!app.props.alerts) return;

    const showAlert = (tracker, distMs) => {
      const alertBody = `Time to track ${tracker.title}? Usually you do it every ${time.formatDurationMs(distMs)}`;
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
