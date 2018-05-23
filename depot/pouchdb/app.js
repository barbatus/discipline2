/* @flow */

import db from './db';

import { App as IApp, Tracker, NewTracker } from '../interfaces';
import trackersDB from './trackers';

class App {
  async create(ver: string, props: any) {
    return db.save('app', { ver, props, trackers: [] });
  }

  async update(app: IApp) {
    return db.save('app', app);
  }

  async get() {
    return db.findOne('app');
  }

  async getRaw() {
    return db.findOneRaw('app');
  }

  async addTracker(data: NewTracker, index?: number): Promise<Tracker> {
    const tracker = await trackersDB.add(data);
    const app = await db.findOneRaw('app');
    const idObj = { id: tracker.id };
    const { trackers } = app;
    const at = index !== undefined ? index : trackers.length;
    trackers.splice(at, 0, idObj);
    await db.save('app', { ...app, trackers });
    return tracker;
  }

  async removeTracker(trackerOrId: string | Tracker) {
    const trackerId = await trackersDB.remove(trackerOrId);
    if (trackerId) {
      const app = await db.findOneRaw('app');
      const { trackers } = app;
      const trackInd = trackers.findIndex((id) => id === trackerId);
      trackers.splice(trackInd, 1);
      await db.save('app', { ...app, trackers });
      return true;
    }
    return false;
  }

  async getVer() {
    const app = await db.findOneRaw('app');
    return app ? app.ver : null;
  }

  async setVer(ver: string) {
    const app = await db.findOneRaw('app');
    return db.save('app', { ...app, ver, testTrackers: [] });
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
