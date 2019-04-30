import { InteractionManager } from 'react-native';
import Reactotron from 'reactotron-react-native';

import Timer from 'app/time/Timer';
import depot from 'app/depot/depot';

import PushNotification from './PushNotification';
import sendNotifications, { MIN_TICKS_DIST_MS } from './sendNotifications';

const CHECKING_INTERVAL = (MIN_TICKS_DIST_MS / 2) * 1000;

class Notifications {
  timer: Timer;

  async start() {
    try {
      if (!this.timer) {
        this.timer = new Timer(0, CHECKING_INTERVAL);
        this.timer.events.on('onTimer', async () => {
          const app = await depot.getApp();
          if (!app.props.alerts) return;
          InteractionManager.runAfterInteractions(() => sendNotifications());
        });
      }
      if (!this.timer.active) {
        await PushNotification.configure();
        this.timer.start();
      }
    } catch (ex) {
      Reactotron.log(ex);
    }
  }

  stop() {
    if (this.timer) {
      this.timer.stop();
    }
  }

  checkPermissions() {
    PushNotification.checkPermissions();
  }

  dispose() {
    if (this.timer) {
      this.timer.dispose();
    }
  }
}

export default new Notifications();
