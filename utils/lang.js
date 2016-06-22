'use strict';

export function caller(cb, ...args: any[]) {
  if (_.isFunction(cb)) {
    cb(...args);
  }
};
