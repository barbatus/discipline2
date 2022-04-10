
import BackgroundFetch from 'react-native-background-fetch';

import Logger from 'app/log';
import Interval from 'app/time/Interval';

import { notify } from './alerts';

const ALERTS_CHECK_INTERVAL_MINS = 15;

function runInBackground() {
  BackgroundFetch.configure({
    minimumFetchInterval: ALERTS_CHECK_INTERVAL_MINS, // minutes (15 is minimum allowed)
    // Android options
    stopOnTerminate: false,
    startOnBoot: true,
  }, async () => {
    await notify();
    BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
  }, (ex) => {
    Logger.error(ex, { context: 'RNBackgroundFetch.configure' });
  });

  BackgroundFetch.status((status) => {
    switch (status) {
      case BackgroundFetch.STATUS_RESTRICTED:
        Logger.log('BackgroundFetch restricted');
        break;
      case BackgroundFetch.STATUS_DENIED:
        Logger.log('BackgroundFetch denied');
        break;
      case BackgroundFetch.STATUS_AVAILABLE:
        Logger.log('BackgroundFetch is enabled');
        break;
    }
  });
}

const interval = new Interval(0, ALERTS_CHECK_INTERVAL_MINS * 60 * 1000);

function runInForeground() {
  interval.start();

  interval.on(notify);
}

let isLaunched = false;

export function launch() {
  if (isLaunched) return;

  runInBackground();
  runInForeground();
  isLaunched = true;
}
