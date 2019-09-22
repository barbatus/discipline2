import check from 'check-types';

import { round, int } from './lang';

const KM_TO_MILES = 0.621371;

const FOOT_TO_MILES = 5280;

export const padZero = (digits) => digits < 10 ? `0${digits}` : `${digits}`;

export function formatSpeed(speed, metric = true) {
  check.assert.number(speed);

  const unit = metric ? 'km/h' : 'mi/h';
  if (speed < 1) {
    return {
      format: () => 0,
      unit,
    };
  }

  const unitSpeed = metric ? speed : round(speed * KM_TO_MILES, 2);
  if (unitSpeed < 10) {
    return {
      format: () => int(unitSpeed * 10) / 10,
      unit,
    };
  }

  return {
    format: () => int(unitSpeed),
    unit,
  };
}

export function formatDistance(dist, metric) {
  check.assert.number(dist);

  if (metric) {
    return formatMetric(dist);
  }
  return formatImperial(dist);
}

export function formatImperial(dist) {
  if (dist * KM_TO_MILES < 0.5) {
    return {
      format: () => int(dist * KM_TO_MILES * FOOT_TO_MILES),
      unit: 'ft',
    };
  }

  const rounded = round(dist * KM_TO_MILES, 2);
  const mi = int(rounded);
  const ft = int(rounded * 100 % 100);

  return {
    format: () => `${mi}.${padZero(ft)}`,
    unit: 'mi',
  };
}

export function formatMetric(dist) {
  if (dist < 1) {
    return {
      format: () => int(dist * 1000),
      unit: 'mi',
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
