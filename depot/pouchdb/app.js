/* @flow */

import db from './db';

import { Tracker } from '../interfaces';

class App {
  async getVer() {
    const app = await db.findOneRaw('app');
    return app ? app.ver : null;
  }

  async setVer(ver: string) {
    const app = await db.findOneRaw('app');
    const newVer = app ? { ...app, ver } : { ver, testTrackers: [] };
    return db.save('app', newVer);
  }

  async getTestTrackers() {
    const app = await db.findOne('app');
    return app.testTrackers;
  }

  async setTestTrackers(testTrackers: Tracker[]) {
    const app = await db.findOne('app');
    return db.save('app', { ...app, testTrackers });
  }

  async hasTestTrackers() {
    const app = await db.findOneRaw('app');
    return app ? !!app.testTrackers.length : false;
  }
}

export default new App();
