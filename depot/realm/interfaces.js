 /* @flow */

declare type TrackersSchemaType = {
  nextId: number,
  trackers: List<Tracker>
};

declare class List<T> extends Array<T> {
  filtered(query: string, ...args: any[]): Array<T>;
};

declare type TickSchemaType = {
  nextId: number
};
