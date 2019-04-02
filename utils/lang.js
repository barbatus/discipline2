import isFunction from 'lodash/isFunction';

export function caller(cb, ...args: *[]) {
  if (isFunction(cb)) {
    cb(...args);
  }
}

export function round(number, precision) {
  const factor = 10 ** precision;
  const factored = number * factor;
  const rounded = Math.round(factored);
  return rounded / factor;
}

export function int(number) {
  return Math.floor(number);
}