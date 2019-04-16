import { InteractionManager } from 'react-native';

import Timer from 'app/time/Timer';

import sendNotifications from './sendNotifications';

const CHECKING_INTERVAL = 10 * 1000;

class Notifications {
  timer = new Timer(0, CHECKING_INTERVAL);

  constructor() {
    this.timer = new Timer(0, CHECKING_INTERVAL);
    this.timer.events.on('onTimer', () => {
      InteractionManager.runAfterInteractions(() => sendNotifications());
    });
  }

  start() {
    this.timer.start();
  }

  dispose() {
    this.timer.dispose();
  }
}

export default new Notifications();
