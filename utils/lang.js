import isFunction from 'lodash/isFunction';

export function caller(cb, ...args: *[]) {
  if (isFunction(cb)) {
    cb(...args);
  }
}

export function round(number, precision = 0) {
  const factor = 10 ** precision;
  const factored = number * factor;
  const rounded = Math.round(factored);
  return rounded / factor;
}

export function int(number) {
  return Math.floor(number);
}

export class ValuedError<T> extends Error {
  value: T;

  constructor(value: T, baseError) {
    super();
    this.value = value;
    this.baseError = baseError;
  }
}

export const noop = () => {};
