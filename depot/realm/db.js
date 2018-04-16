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
    id: 'string',
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
    id: 'string',
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
    dist: { type: 'linkingObjects', objectType: 'DistData', property: 'tick' },
  },
};

const DistanceDataSchema = {
  name: 'DistData',
  properties: {
    tick: 'Tick',
    time: {
      type: 'int',
    },
    latlon: {
      type: 'list',
      objectType: 'LatLon',
      default: [],
    },
  },
};

const LatLonSchema = {
  name: 'LatLon',
  properties: {
    lat: 'float',
    lon: 'float',
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
    LatLonSchema,
  ],
});
export default DB;
