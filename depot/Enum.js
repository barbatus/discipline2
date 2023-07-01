import assert from 'assert';
import check from 'check-types';

import has from 'lodash/has';

export class EnumSymbol {
  constructor(key: String, props: Object) {
    check.assert.string(key);
    assert(has(props, 'value'));

    this.key = key;

    Object.getOwnPropertyNames(props).forEach(
      (prop) => (this[prop] = props[prop]),
    );

    Object.freeze(this);
  }

  toString() {
    return this.sym;
  }

  valueOf() {
    return this.value;
  }
}

export default class Enum {
  constructor(enumLiterals: Object) {
    Object.getOwnPropertyNames(enumLiterals).forEach(
      (key) => (this[key] = new EnumSymbol(key, enumLiterals[key])),
    );

    Object.freeze(this);
  }

  symbols() {
    return this.keys().map((key) => this[key]);
  }

  keys() {
    return Object.keys(this);
  }

  values() {
    return this.symbols().map((sym) => sym.valueOf());
  }

  /* eslint-disable eqeqeq */
  fromValue(value) {
    return this.symbols().find((sym) => sym == value);
  }
  /* eslint-enable eqeqeq */

  fromKey(key) {
    return this[key];
  }
}
