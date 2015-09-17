var icons = {
  coffee: require('image!coffee'),
  stopwatch: require('image!stopwatch'),
  pizza: require('image!pizza'),
  sneakers: require('image!sneakers'),
  check: require('image!check'),
  plus: require('image!plus'),
  minus: require('image!minus')
};

class IconStore {
  static load(iconId) {
    return icons[iconId];
  }
}

module.exports = IconStore;
