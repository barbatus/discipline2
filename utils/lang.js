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
  for (let key in v) {
    if (v[key] !== o[key]) {
      return false;
    }
  }

  for (let key in o) {
    if (v[key] !== o[key]) {
      return false;
    }
  }

  return true;
}
