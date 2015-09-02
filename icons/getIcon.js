var IconStore = require('./IconStore');

function getIcon(iconId) {
  return IconStore.load(iconId);
}

module.exports = getIcon;
