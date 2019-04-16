import Reactotron from 'reactotron-react-native';

import depot from '../depot/depot';

export default async function () {
  const app = await depot.getApp();
  app.trackers.forEach(async (tracker) => {
    const ticks = await depot.getLastTrackerTicks(tracker.id, 5);
    Reactotron.log(ticks);
  });
}
