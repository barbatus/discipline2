/* @flow */
/* eslint no-undef: off */

import {
  TrackerToPropType,
  type CopilotScreenId,
  type CopilotStepId,
  type TrackerId,
} from './consts';

export type Copilot = {
  [key: CopilotScreenId]: CopilotStepId,
};

export type AppProps = { alerts: boolean, copilot: Copilot };

export interface App {
  ver: string;
  props: AppProps;
  trackers: Array<Tracker>;
}

export interface RawApp {
  ver: string;
  props: AppProps;
  trackers: Array<string>;
}

export type PropType = {
  [string]: *,
};

export interface Tracker {
  id: string;
  title: string;
  typeId: TrackerId;
  iconId: string;
  active: boolean;
  ticks?: Array<Tick>;
  alerts?: Array<Alert>;
  props: Array<PropType>;
  createdAt: number;
}

export interface NewTracker {
  title: string;
  typeId: string;
  iconId: string;
  props: Array<PropType>;
}

export type PlainTick = Tick & PropType;

export interface Tick {
  id: string;
  createdAt: number;
  value: number;
  data: any;
  [key: $Values<typeof TrackerToPropType>]: Object;
}

export interface Alert {
  id: string;
  createdAt: number;
}
