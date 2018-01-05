/* @flow */

import Realm from 'realm';

const AppInfoSchema = {
  name: 'AppInfo',
  properties: {
    ver: 'string',
    testTrackers: {
      type: 'list',
      objectType: 'Tracker',
      default: [],
    },
  },
};

const TrackerPropsSchema = {
  name: 'TrackerProps',
  properties: {
    alerts: { type: 'bool', default: false },
  },
};

const TrackerSchema = {
  name: 'Tracker',
  primaryKey: 'id',
  properties: {
    id: 'int',
    title: { type: 'string', optional: true },
    typeId: 'string',
    iconId: { type: 'string', optional: true },
    props: 'TrackerProps',
  },
};

const TrackersSchema = {
  name: 'Trackers',
  properties: {
    nextId: {
      type: 'int',
      default: 1,
    },
    trackers: {
      type: 'list',
      objectType: 'Tracker',
      default: [],
    },
  },
};

const TicksSchema = {
  name: 'Ticks',
  properties: {
    nextId: {
      type: 'int',
      default: 1,
    },
  },
};

const TickSchema = {
  name: 'Tick',
  primaryKey: 'id',
  properties: {
    id: 'int',
    trackId: {
      type: 'int',
      indexed: true,
    },
    dateTimeMs: {
      type: 'int',
      indexed: true,
    },
    value: {
      type: 'float',
      optional: true,
    },
  },
};

const DistanceDataSchema = {
  name: 'DistData',
  properties: {
    tickId: {
      type: 'int',
      indexed: true,
    },
    time: {
      type: 'int',
    },
  },
};

const DB = new Realm({
  schema: [
    AppInfoSchema,
    TrackersSchema,
    TrackerSchema,
    TickSchema,
    TicksSchema,
    DistanceDataSchema,
    TrackerPropsSchema,
  ],
});
export default DB;
