'use strict';

export function caller(cb, ...args: any[]) {
  if (_.isFunction(cb)) {
    cb(...args);
  }
};

export function round(number, precision) {
  const factor = Math.pow(10, precision);
  const factored = number * factor;
  const rounded = Math.round(factored);
  return rounded / factor;
};

export function int(number) {
  return number >> 0;
};
