import Bugsnag from '@bugsnag/react-native';
import Reactotron from 'reactotron-react-native';
import DeviceInfo from 'react-native-device-info';

import env from 'react-native-config';

import PushNotification from 'app/notifications';

import appConfig from '../appConfig.json';

const bugsnagStartPromise = Promise.all([
  DeviceInfo.getUniqueId(),
  DeviceInfo.getDeviceId(),
]).then(([id, device]) => {
  Bugsnag.start({
    releaseStage: env.NAME,
    user: {
      id,
      name: `user@${device}`,
    },
  });
});

const isLocal = env.NAME === 'local';
const isBeta = env.NAME === 'staging';
const isProd = env.NAME === 'production';

if (isLocal) {
  import('./reactotron');
}

if (isBeta) {
  PushNotification.configure();
}

const Logger = {
  leaveBreadcrumb(message) {
    bugsnagStartPromise.then(() => {
      Bugsnag.leaveBreadcrumb(message);
    });
  },
  log(message, { context } = {}) {
    const logMsg = context ? `${context}: ${message}` : message;
    if (isLocal) {
      Reactotron.log(logMsg);
    }
    if (isBeta) {
      PushNotification.localNotification('Logger: Info', logMsg, true);
    }
  },
  error(error, { context }) {
    const errorMsg = error.message || `Unknown error ${error.toString()}`;
    const logMsg = context ? `${context}: ${errorMsg}` : errorMsg;
    if (isLocal) {
      Reactotron.error(error);
    }
    if (isBeta) {
      PushNotification.localNotification('Logger: Error', logMsg, true);
    }
  },
  notify(error) {
    this.error(error);
    if (isBeta || isProd) {
      Bugsnag.notify(error);
    }
  },
};

export default Logger;
