/* @flow */

import DB from './db';

class AppInfoDepot {
  getVer() {
    const appInfo = DB.objects('AppInfo')[0];
    return appInfo ? appInfo.ver : null;
  }

  setVer(ver: string) {
    const appInfo = DB.objects('AppInfo')[0];
    DB.write(() => {
      if (appInfo) {
        appInfo.ver = ver;
        return;
      }
      DB.create('AppInfo', { ver });
    });
  }

  getTestTrackers() {
    const appInfo = DB.objects('AppInfo')[0];
    return appInfo ? appInfo.testTrackers.slice() : [];
  }

  setTestTrackers(trackers) {
    const appInfo = DB.objects('AppInfo')[0];
    DB.write(() => {
      if (appInfo) {
        appInfo.testTrackers = trackers;
        return;
      }
      DB.create('AppInfo', {
        testTrackers: trackers,
      });
    });
  }
}

let depot = new AppInfoDepot();
export default depot;
