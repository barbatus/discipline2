import appIcons from './appIcons';

export default class AppIconsStore {
  static get(iconId) {
    return appIcons[iconId];
  }
}
