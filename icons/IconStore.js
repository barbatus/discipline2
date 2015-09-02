var icons = {
  coffee: require('image!coffee'),
  stopwatch: require('image!stopwatch'),
  pizza: require('image!pizza'),
  sneakers: require('image!sneakers')
};

class IconStore {
  static load(iconId) {
    return icons[iconId];
  }
}

module.exports = IconStore;
