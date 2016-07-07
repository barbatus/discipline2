'use strict';

import {IconSize} from './consts';

import Enum from '../depot/Enum';

const UserIcons = new Enum({
  COFFEE: {
    value: 'coffee',
    [IconSize.NORMAL]: require('./files/user/coffee.png')
  },
  STOPWATCH: {
    value: 'stopwatch',
    [IconSize.NORMAL]: require('./files/user/stopwatch.png')
  },
  PIZZA: {
    value: 'pizza',
    [IconSize.NORMAL]: require('./files/user/pizza.png')
  },
  SNEAKERS: {
    value: 'sneakers',
    [IconSize.NORMAL]: require('./files/user/sneakers.png')
  },
  MARKER: {
    value: 'marker',
    [IconSize.NORMAL]: require('./files/user/marker.png')
  },
  FOLDER: {
    value: 'folder',
    [IconSize.NORMAL]: require('./files/user/folder.png')
  },
  BELL: {
    value: 'bell',
    [IconSize.NORMAL]: require('./files/user/bell.png')
  },
  MITTEN: {
    value: 'mitten',
    [IconSize.NORMAL]: require('./files/user/mitten.png')
  },
  GHOST: {
    value: 'ghost',
    [IconSize.NORMAL]: require('./files/user/ghost.png')
  },
  WED_GIFT: {
    value: 'wed_gift',
    [IconSize.NORMAL]: require('./files/user/wed_gift.png')
  },
  IDEA: {
    value: 'idea',
    [IconSize.NORMAL]: require('./files/user/idea.png')
  },
  MUSIC: {
    value: 'music',
    [IconSize.NORMAL]: require('./files/user/music.png')
  },
  OPEN_FOLDER: {
    value: 'open_folder',
    [IconSize.NORMAL]: require('./files/user/open_folder.png')
  },
  TRASH: {
    value: 'trash',
    [IconSize.NORMAL]: require('./files/user/trash.png')
  },
  INFO: {
    value: 'info',
    [IconSize.NORMAL]: require('./files/user/info.png')
  },
  NEWS: {
    value: 'news',
    [IconSize.NORMAL]: require('./files/user/news.png')
  },
  PICTURE: {
    value: 'picture',
    [IconSize.NORMAL]: require('./files/user/picture.png')
  },
  HAND: {
    value: 'hand',
    [IconSize.NORMAL]: require('./files/user/hand.png')
  },
  NO_IDEA: {
    value: 'no_idea',
    [IconSize.NORMAL]: require('./files/user/no_idea.png')
  },
  PUZZLE: {
    value: 'puzzle',
    [IconSize.NORMAL]: require('./files/user/puzzle.png')
  },
  HOUSE: {
    value: 'house',
    [IconSize.NORMAL]: require('./files/user/house.png')
  },
  LOCK: {
    value: 'lock',
    [IconSize.NORMAL]: require('./files/user/lock.png')
  },
  OK: {
    value: 'ok',
    [IconSize.NORMAL]: require('./files/user/ok.png')
  },
  RATE: {
    value: 'rate',
    [IconSize.NORMAL]: require('./files/user/rate.png')
  },
  COMET: {
    value: 'comet',
    [IconSize.NORMAL]: require('./files/user/comet.png')
  },
  SCI_FI: {
    value: 'sci_fi',
    [IconSize.NORMAL]: require('./files/user/sci_fi.png')
  },
  BOOBS: {
    value: 'boobs',
    [IconSize.NORMAL]: require('./files/user/boobs.png')
  },
  ASTRONAUT: {
    value: 'astronaut',
    [IconSize.NORMAL]: require('./files/user/astronaut.png')
  },
  FAMILY: {
    value: 'family',
    [IconSize.NORMAL]: require('./files/user/family.png')
  },
  PLANET: {
    value: 'planet',
    [IconSize.NORMAL]: require('./files/user/planet.png')
  },
  SPORT: {
    value: 'sport',
    [IconSize.NORMAL]: require('./files/user/sport.png')
  }
});

module.exports = UserIcons;
