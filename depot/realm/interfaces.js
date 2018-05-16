import { Tracker } from '../interfaces';

export interface TrackersSchemaType {
  nextId: number;
  trackers: List<Tracker>;
}

export interface List<T> extends Array<T> {
  filtered(query: string, ...args: any[]): Array<T>;
}

export interface TickSchemaType {
  nextId: number;
}
