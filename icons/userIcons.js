'use strict';

import {IconSize} from './consts';

import Enum from '../depot/Enum';

const sashaIcons = './files/user/sasha';

const icon8Icons = './files/user/icon8';

const UserIcons = new Enum({
  ASTRONAUT: {
    value: 'astronaut',
    [IconSize.NORMAL]: require('./files/user/icon8/astronaut.png')
  },
  AIRPLANE_TAKEOFF: {
    value: 'airplane_takeoff',
    [IconSize.NORMAL]: require('./files/user/icon8/airplane_take_off.png')
  },
  BAR: {
    value: 'bar',
    [IconSize.NORMAL]: require('./files/user/icon8/bar.png')
  },
  BELL: {
    value: 'bell',
    [IconSize.NORMAL]: require('./files/user/icon8/bell.png')
  },
  BOOK_SHELF: {
    value: 'book_shelf',
    [IconSize.NORMAL]: require('./files/user/icon8/book_shelf.png')
  },
  BREAST: {
    value: 'breast',
    [IconSize.NORMAL]: require('./files/user/icon8/breast.png')
  },
  BRIEFCASE: {
    value: 'briefcase',
    [IconSize.NORMAL]: require('./files/user/icon8/briefcase.png')
  },
  CHIP: {
    value: 'ship',
    [IconSize.NORMAL]: require('./files/user/icon8/chip.png')
  },
  COFFEE: {
    value: 'coffee',
    [IconSize.NORMAL]: require('./files/user/icon8/coffee_to_go.png')
  },
  COMET: {
    value: 'comet',
    [IconSize.NORMAL]: require('./files/user/icon8/comet.png')
  },
  FAMILY: {
    value: 'family',
    [IconSize.NORMAL]: require('./files/user/icon8/family.png')
  },
  FOLDER: {
    value: 'folder',
    [IconSize.NORMAL]: require('./files/user/icon8/folder.png')
  },
  HAND: {
    value: 'hand',
    [IconSize.NORMAL]: require('./files/user/icon8/hand_cursor.png')
  },
  HOME: {
    value: 'home',
    [IconSize.NORMAL]: require('./files/user/icon8/home.png')
  },
  IDEA: {
    value: 'idea',
    [IconSize.NORMAL]: require('./files/user/icon8/idea.png')
  },
  INFO: {
    value: 'info',
    [IconSize.NORMAL]: require('./files/user/icon8/info.png')
  },
  LOCK: {
    value: 'lock',
    [IconSize.NORMAL]: require('./files/user/icon8/lock.png')
  },
  MAP_MARKER: {
    value: 'map_marker',
    [IconSize.NORMAL]: require('./files/user/icon8/map_marker.png')
  },
  MEDITATION: {
    value: 'meditation',
    [IconSize.NORMAL]: require('./files/user/icon8/meditation_guru.png')
  },
  MUSIC: {
    value: 'music',
    [IconSize.NORMAL]: require('./files/user/icon8/music.png')
  },
  NEWS: {
    value: 'news',
    [IconSize.NORMAL]: require('./files/user/icon8/news.png')
  },
  PIZZA: {
    value: 'pizza',
    [IconSize.NORMAL]: require('./files/user/icon8/pizza.png')
  },
  PLANET: {
    value: 'planet',
    [IconSize.NORMAL]: require('./files/user/icon8/planet.png')
  },
  READING: {
    value: 'reading',
    [IconSize.NORMAL]: require('./files/user/icon8/reading.png')
  },
  SALES: {
    value: 'sales',
    [IconSize.NORMAL]: require('./files/user/icon8/sales_performance.png')
  },
  SHOPPING_CART: {
    value: 'shopping_cart',
    [IconSize.NORMAL]: require('./files/user/icon8/shopping_cart.png')
  },
  SPORT: {
    value: 'sport',
    [IconSize.NORMAL]: require('./files/user/icon8/sport.png')
  },
  STOPWATCH: {
    value: 'stopwatch',
    [IconSize.NORMAL]: require('./files/user/icon8/stopwatch.png')
  },
  SUNBATHE: {
    value: 'sunbathe',
    [IconSize.NORMAL]: require('./files/user/icon8/sunbathe.png')
  },
  TRAINERS: {
    value: 'trainers',
    [IconSize.NORMAL]: require('./files/user/icon8/trainers.png')
  },
  TRAM: {
    value: 'tram',
    [IconSize.NORMAL]: require('./files/user/icon8/tram.png')
  },
  TRASH: {
    value: 'trash',
    [IconSize.NORMAL]: require('./files/user/icon8/trash.png')
  },
  WED_GIFT: {
    value: 'wed_gift',
    [IconSize.NORMAL]: require('./files/user/icon8/wedding_gift.png')
  },
  XMAS_STOCKING: {
    value: 'xmas_stocking',
    [IconSize.NORMAL]: require('./files/user/icon8/xmas_stocking.png')
  },
});

module.exports = UserIcons;
