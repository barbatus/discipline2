/* eslint no-underscore-dangle: 0 */
import PouchDB from '@craftzdog/pouchdb-core-react-native';
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
      trackers: { hasMany: 'tracker' },
    },
  },
  {
    singular: 'tracker',
    plural: 'trackers',
    relations: {
      ticks: {
        hasMany: {
          type: 'tick',
          options: { async: true },
        },
      },
      alerts: {
        hasMany: {
          type: 'alert',
          options: { async: true },
        },
      },
      app: {
        belongsTo: {
          type: 'app',
          options: { async: true },
        },
      },
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
  {
    singular: 'alert',
    plural: 'alerts',
    relations: {
      tracker: {
        belongsTo: {
          type: 'tracker',
          options: { async: true },
        },
      },
    },
  },
]);

db.createIndex({
  index: {
    fields: ['data.createdAt', 'data.tracker', '_id'],
  },
});

// For sorting by createdAt
db.createIndex({
  index: {
    fields: ['data.createdAt'],
  },
});

// db.createIndex({
//   index: { fields: ['data.tracker', '_id'] },
// });

db.createIndex({
  index: { fields: ['data.tick', '_id'] },
});

db.createIndex({
  index: { fields: ['data.alert', '_id'] },
});

function fromRawDoc(pouchDoc: Object) {
  const obj = pouchDoc.data;
  obj.id = db.rel.parseDocID(pouchDoc._id).id;
  obj.rev = pouchDoc._rev;
  return obj;
}

const api = {
  save: async (type: string, doc: Object) => {
    try {
      return (await db.rel.save(type, doc))[`${type}s`][0];
    } catch (error) {
      // Resolve update conflict
      if (error.status === 409) {
        const savedDoc = await api.find(type, doc.id);
        return api.save(type, { ...doc, rev: savedDoc.rev });
      }
      throw error;
    }
  },
  del: async (type: string, doc: Object) =>
    (await db.rel.del(type, doc)).deleted,
  find: async (type: string, id: string) =>
    (await db.rel.find(type, id))[`${type}s`][0],
  findAll: async (type: string) => (await db.rel.find(type))[`${type}s`],
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
  findHasMany: async (type: string, relType: string, relId: string) =>
    (await api.selectHasMany(type, relType, relId))[`${type}s`],
  merge: (type: string, result: Object) => {
    let typeValues = result[`${type}s`];
    const types = `${type}s`;
    const keys = Object.keys(result).filter((key) => key !== types);
    keys.forEach((resTypes) => {
      const resType = resTypes.replace(/s$/, '');
      const datas = result[resTypes];
      typeValues = typeValues.map((value) => {
        const ids = value[resType] || value[resTypes];
        const valueData = Array.isArray(ids)
          ? ids.map((id) => datas.find((dt) => id === dt.id))
          : datas.find((dt) => ids === dt.id);
        if (valueData) {
          const mergedValue = { ...value };
          if (Array.isArray(ids)) {
            mergedValue[resTypes] = valueData;
            return mergedValue;
          }
          mergedValue[resType] = valueData;
          return mergedValue;
        }
        return value;
      });
    });
    return typeValues;
  },
  selectBy: async (
    type: string,
    relType: string,
    relId: string,
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
    selector[`data.${relType}`] = relId;
    selector[`data.${field}`] = { $gte: minValue, $lt: maxValue };
    const result = await db
      .find({ selector, sort: [{ [`data.${field}`]: 'asc' }] })
      .then((findRes) => db.rel.parseRelDocs(type, findRes.docs));
    return api.merge(type, result);
  },
  selectOrderBy: async (
    type: string,
    relType: string,
    relId: string,
    orderByField: string,
    limit = 1,
    minValue: number = null,
    maxValue: number = null,
  ) => {
    const selector = {
      _id: {
        $gt: db.rel.makeDocID({ type }),
        $lt: db.rel.makeDocID({ type, id: {} }),
      },
    };
    selector[`data.${relType}`] = relId;
    selector[`data.${orderByField}`] = { $gte: minValue, $lt: maxValue };
    const result = await db
      .find({
        selector,
        sort: [{ [`data.${orderByField}`]: 'desc' }],
        limit,
      })
      .then((findRes) => db.rel.parseRelDocs(type, findRes.docs));
    return api.merge(type, result);
  },
  selectHasMany: async (type: string, relType: string, relId: string) => {
    const selector = {
      _id: {
        $gt: db.rel.makeDocID({ type }),
        $lt: db.rel.makeDocID({ type, id: {} }),
      },
    };
    selector[`data.${relType}`] = relId;
    selector['data.createdAt'] = { $gte: null };
    return db
      .find({ selector })
      .then((findRes) => db.rel.parseRelDocs(type, findRes.docs));
  },
};

export default api;
