import Reactotron from 'reactotron-react-native';
import regression from 'regression';

import time from 'app/time/utils';
import depot from 'app/depot/depot';

import PushNotification from './PushNotification';

export const MIN_TICKS_DIST_MS = 10 * 60 * 1000;

export const MIN_TICKS_AMOUNT = 5;

function checkIfTicksFit(ticks) {
  const dists = [];
  for (let i = 0; i < ticks.length - 1; i++) {
    dists.push(ticks[i + 1].createdAt - ticks[i].createdAt);
  }
  const validDists = dists.filter((dist) => dist >= MIN_TICKS_DIST_MS);
  return validDists.length >= MIN_TICKS_AMOUNT - 1;
}

function predictNextDist(ticks) {
  const dots = [];
  for (let i = 0; i < ticks.length - 1; i++) {
    dots.push([i + 1, ticks[i + 1].createdAt - ticks[i].createdAt]);
  }
  const result = regression.linear(dots);
  return result.predict(ticks.length)[1];
}

export default async function () {
  const app = await depot.getApp();
  const tracksToNotify = app.trackers.filter((tracker) => tracker.props.alerts);
  tracksToNotify.forEach(async (tracker) => {
    const ticks = await depot.getLastTrackerTicks(tracker.id, MIN_TICKS_AMOUNT * 2);
    const lastTick = ticks[ticks.length - 1];
    const lastNotif = await depot.getLastNotif(tracker.id);

    if (lastTick && lastNotif && lastTick.createdAt <= lastNotif.createdAt) return;

    if (!checkIfTicksFit(ticks)) return;

    const nextDistMs = predictNextDist(ticks);
    const distToNow = Date.now() - (lastTick.createdAt + nextDistMs);
    if (distToNow < 0) return;

    let averageDist = 0;
    for (let i = 0; i < ticks.length - 1; i++) {
      averageDist += (ticks[i + 1].createdAt - ticks[i].createdAt);
    }
    averageDist /= (ticks.length - 1);
    try {
      await depot.addNotif(tracker.id, time.getNowMs());
      const alertBody = `Usually you use this tracker every ${time.formatDurationMs(averageDist)}`;
      PushNotification.localNotification(`${tracker.title} Tracker`, alertBody);
    } catch (ex) {
      Reactotron.error(ex);
    }
  });
}
