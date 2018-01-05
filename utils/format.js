import { round, int } from './lang';

export const __ = (digits) => digits < 10 ? `0${digits}` : `${digits}`;

export function formatDistance(dist) {
  check.assert.number(dist);

  if (dist < 1) {
    return {
      format: int(dist * 1000),
      unit: 'm',
    };
  }

  const rounded = round(dist, 2);
  const km = int(rounded);
  const mm = int(rounded * 100 % 100);

  return {
    format: `${km}.${__(mm)}`,
    unit: 'km',
  };
}
