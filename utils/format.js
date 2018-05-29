import check from 'check-types';

import { round, int } from './lang';

const MILES_TO_KM = 0.621371;

const FOOT_TO_MILES = 5280;

export const padZero = (digits) => digits < 10 ? `0${digits}` : `${digits}`;

export function formatDistance(dist, metric) {
  check.assert.number(dist);

  if (metric) {
    return formatMetric(dist);
  }
  return formatImperial(dist);
}

export function formatImperial(dist) {
  if (dist < 1) {
    return {
      format: () => int(dist * FOOT_TO_MILES),
      unit: 'ft',
    };
  }

  const rounded = round(dist * MILES_TO_KM, 2);
  const mi = int(rounded);
  const mm = int(rounded * 100 % 100);

  return {
    format: () => `${mi}.${padZero(mm)}`,
    unit: 'mi',
  };
}

export function formatMetric(dist) {
  if (dist < 1) {
    return {
      format: () => int(dist * 1000),
      unit: 'm',
    };
  }

  const rounded = round(dist, 2);
  const km = int(rounded);
  const mm = int(rounded * 100 % 100);

  return {
    format: () => `${km}.${padZero(mm)}`,
    unit: 'km',
  };
}
