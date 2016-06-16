'use strict';

class EnumSymbol {
  constructor(key: String, props: Object) {
    check.assert.string(key);
    assert(_.has(props, 'value'));

    this.key = key;

    for (let prop in props) {
      this[prop] = props[prop];
    }

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
  constructor(enumLiterals) {
    for (let key in enumLiterals) {
      this[key] = new EnumSymbol(key, enumLiterals[key]);
    }

    Object.freeze(this);
  }

  symbols() {
    return this.keys().map(
      key => this[key]);
  }

  keys() {
    return Object.keys(this);
  }

  values() {
    return this.symbols().map(
      sym => sym.valueOf());
  }

  fromValue(value) {
    let sym = this.symbols().find(
      sym => sym == value);
    return sym;
  }

  fromKey(key) {
    return this[key];
  }
}
