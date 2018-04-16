import PouchDB from 'pouchdb-react-native';
import SQLite from 'react-native-sqlite-2';
import SQLiteAdapterFactory from 'pouchdb-adapter-react-native-sqlite';
import Relational from 'relational-pouch';
import Find from 'pouchdb-find';

const SQLiteAdapter = SQLiteAdapterFactory(SQLite);
PouchDB.plugin(SQLiteAdapter);
PouchDB.plugin(Relational);
PouchDB.plugin(Find);

const db = new PouchDB('db', { adapter: 'react-native-sqlite' });
db.setSchema([
  {
    singular: 'app',
    plural: 'apps',
    relations: {
      testTrackers: { hasMany: 'tracker' },
    },
  },
  {
    singular: 'tracker',
    plural: 'trackers',
    relations: {
      ticks: { hasMany: {
        type: 'tick',
        options: { async: true } },
      },
      list: { belongsTo: {
        type: 'trackerList',
        options: { async: true } },
      },
    },
  },
  {
    singular: 'trackerList',
    plural: 'trackerLists',
    relations: {
      trackers: { hasMany: 'tracker' },
    },
  },
  {
    singular: 'tick',
    plural: 'ticks',
    relations: {
      tracker: {
        belongsTo: {
          type: 'tracker',
          options: { async: true },
        },
      },
      distData: { belongsTo: 'distData' },
    },
  },
  {
    singular: 'distData',
    plural: 'distDatas',
    relations: {
      tick: {
        belongsTo: {
          type: 'tick',
          options: { async: true },
        },
      },
    },
  },
]);

db.createIndex({
  index: {
    fields: ['data.dateTimeMs', 'data.tracker', '_id'],
  },
});

db.createIndex({
  index: { fields: ['data.tracker', '_id'] },
});

db.createIndex({
  index: { fields: ['data.tick', '_id'] },
});

export const TRACKER_TICK_DATA_TYPE = {
  distance: 'distData',
};

function fromRawDoc(pouchDoc: Object) {
  const obj = pouchDoc.data;
  obj.id = db.rel.parseDocID(pouchDoc._id).id;
  obj.rev = pouchDoc._rev;
  return obj;
}

const api = {
  save: async (type: string, data: Object) =>
    (await db.rel.save(type, data))[`${type}s`][0],
  del: async (type: string, obj: Object) =>
    (await db.rel.del(type, obj)).deleted,
  find: async (type: string, id: string) =>
    (await db.rel.find(type, id))[`${type}s`][0],
  findAll: async (type: string) =>
    (await db.rel.find(type))[`${type}s`],
  findOne: async (type: string) => {
    const result = await db.rel.find(type);
    return api.merge(type, result)[0];
  },
  findOneRaw: async (type: string) => {
    const result = await db.allDocs({
      include_docs: true,
      startkey: db.rel.makeDocID({ type }),
      endkey: db.rel.makeDocID({ type, id: {} }),
    });
    const docs = result.rows
      .filter((row) => row.doc && !row.value.deleted)
      .map((row) => row.doc);
    const doc = docs[0];
    return doc ? fromRawDoc(doc) : null;
  },
  findHasMany: async (type: string, relType: string, id: string) =>
    (await db.rel.findHasMany(type, relType, id))[`${type}s`],
  merge: (type: string, result: Object) => {
    let typeValues = result[`${type}s`];
    const types = `${type}s`;
    const keys = Object.keys(result)
      .filter((key) => key !== types);
    keys.forEach((resTypes) => {
      const resType = resTypes.replace(/s$/, '');
      const datas = result[resTypes];
      typeValues = typeValues.map((value) => {
        const ids = value[resType] || value[resTypes];
        const valueData = Array.isArray(ids) ?
          ids.map((id) => datas.find((dt) => id === dt.id)) :
          datas.find((id) => id === ids);
        if (valueData.length) {
          const mergedValue = { ...value };
          if (Array.isArray(ids)) {
            mergedValue[resTypes] = valueData;
            return mergedValue;
          }
          mergedValue[resType] = valueData[0];
          return mergedValue;
        }
        return value;
      });
    });
    return typeValues;
  },
  selectBy: async (
    type: string,
    depType: string,
    depId: string,
    field: string,
    minValue: number,
    maxValue: number,
  ) => {
    const selector = {
      _id: {
        $gt: db.rel.makeDocID({ type }),
        $lt: db.rel.makeDocID({ type, id: {} }),
      },
    };
    selector[`data.${depType}`] = depId;
    selector[`data.${field}`] = { $gte: minValue, $lt: maxValue };
    const result = await db.find({ selector }).then((findRes) =>
      db.rel.parseRelDocs(type, findRes.docs)
    );
    return api.merge('tick', result);
  },
};

export default api;
