var icons = {
  back: require('./files/back.png'),
  coffee: require('./files/coffee.png'),
  stopwatch: require('./files/stopwatch.png'),
  pizza: require('./files/pizza.png'),
  sneakers: require('./files/sneakers.png'),
  check: require('./files/check.png'),
  plus: require('./files/plus.png'),
  minus: require('./files/minus.png'),
  info: require('./files/info.png'),
  menu: require('./files/menu.png'),
  new: require('./files/new.png'),
  cancel: require('./files/cancel.png'),
  accept: require('./files/accept.png'),
  oval: require('./files/oval.png'),
  marker: require('./files/marker.png'),
  goal: require('./files/goal.png'),
  counter: require('./files/counter.png'),
  sum: require('./files/sum.png'),
  next: require('./files/next.png')
};

class IconStore {
  static load(iconId) {
    return icons[iconId];
  }
}

module.exports = IconStore;
