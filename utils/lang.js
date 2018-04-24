import { isFunction } from 'lodash';

export function caller(cb, ...args: any[]) {
  if (isFunction(cb)) {
    cb(...args);
  }
}

export function round(number, precision) {
  const factor = Math.pow(10, precision);
  const factored = number * factor;
  const rounded = Math.round(factored);
  return rounded / factor;
}

export function int(number) {
  return Math.floor(number);
}

export function isShallowEqual(v, o) {
  for (const key of Object.keys(v)) {
    if (v[key] !== o[key]) {
      return false;
    }
  }

  for (const key of Object.keys(o)) {
    if (v[key] !== o[key]) {
      return false;
    }
  }

  return true;
}
