
import { Client, Configuration } from 'bugsnag-react-native';
import Reactotron from 'reactotron-react-native';

import env from 'react-native-config';

import PushNotification from 'app/notifications';

const isLocal = env.NAME === 'local';
const isBeta = env.NAME === 'beta';
const isProd = env.NAME === 'prod';

const config = new Configuration();
config.apiKey = env.BUGSNAG;
config.notifyReleaseStages = ['beta', 'prod'];
config.releaseStage = env.NAME;
const remoteLogger = new Client(config);

if (isLocal) {
  import('./reactotron');
}

if (isBeta) {
  PushNotification.configure();
}

const Logger = {
  init() {
    if (isBeta) {
      PushNotification.configure();
    }
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
    const logMsg = context ? `${context}: ${error.message}` : error.message;
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
      remoteLogger.notify(error);
    }
  },
};

export default Logger;
