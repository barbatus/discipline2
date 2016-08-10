'use strict';

export function caller(cb, ...args: any[]) {
  if (_.isFunction(cb)) {
    cb(...args);
  }
};

export function round(number, precision) {
  let factor = Math.pow(10, precision);
  let factored = number * factor;
  let rounded = Math.round(factored);
  return rounded / factor;
};
