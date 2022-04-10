/* eslint-disable global-require */

import { IconSize } from './consts';

import Enum from '../depot/Enum';

const UserIcons = new Enum({
  ASTRONAUT: {
    value: 'astronaut',
    [IconSize.NORMAL]: require('./files/user/icon8/astronaut.png'),
    tags: ['astronaut', 'cosmos'],
  },
  AIRPLANE_TAKEOFF: {
    value: 'airplane_takeoff',
    [IconSize.NORMAL]: require('./files/user/icon8/airplane_take_off.png'),
    tags: ['airplane', 'travel'],
  },
  AVOCADO: {
    value: 'avocado',
    [IconSize.NORMAL]: require('./files/user/icon8/avocado.png'),
    tags: ['avocado', 'veggies', 'breakfast', 'green'],
  },
  BABY: {
    value: 'baby',
    [IconSize.NORMAL]: require('./files/user/icon8/baby.png'),
    tags: ['baby', 'family'],
  },
  BALL_POINT_PEN: {
    value: 'ball_point_pen',
    [IconSize.NORMAL]: require('./files/user/icon8/ball_point_pen.png'),
    tags: ['writing', 'pen', 'note'],
  },
  BAR: {
    value: 'bar',
    [IconSize.NORMAL]: require('./files/user/icon8/bar.png'),
    tags: [],
  },
  BARBELL: {
    value: 'barbell',
    [IconSize.NORMAL]: require('./files/user/icon8/barbell.png'),
    tags: ['weight', 'lifting', 'gym'],
  },
  BARBERSHOP: {
    value: 'barbershop',
    [IconSize.NORMAL]: require('./files/user/icon8/barbershop.png'),
    tags: ['barbershop', 'hair'],
  },
  BEACH: {
    value: 'beach',
    [IconSize.NORMAL]: require('./files/user/icon8/beach.png'),
    tags: ['beach', 'holidays', 'travel'],
  },
  BELL: {
    value: 'bell',
    [IconSize.NORMAL]: require('./files/user/icon8/bell.png'),
    tags: ['bell'],
  },
  BEER: {
    value: 'beer',
    [IconSize.NORMAL]: require('./files/user/icon8/beer.png'),
    tags: ['beer', 'alcohol', 'drinking'],
  },
  BEING_SICK: {
    value: 'being_sick',
    [IconSize.NORMAL]: require('./files/user/icon8/being_sick.png'),
    tags: ['disease', 'sick', 'health', 'ill'],
  },
  BICYCLE: {
    value: 'bicycle',
    [IconSize.NORMAL]: require('./files/user/icon8/bicycle.png'),
    tags: ['bicycle', 'sport'],
  },
  BOOK_SHELF: {
    value: 'book_shelf',
    [IconSize.NORMAL]: require('./files/user/icon8/book_shelf.png'),
    tags: ['book', 'reading'],
  },
  BREAST: {
    value: 'breast',
    [IconSize.NORMAL]: require('./files/user/icon8/breast.png'),
    tags: ['breast', 'sex'],
  },
  BRIEFCASE: {
    value: 'briefcase',
    [IconSize.NORMAL]: require('./files/user/icon8/briefcase.png'),
    tags: ['briefcase', 'business'],
  },
  BUYING: {
    value: 'buying',
    [IconSize.NORMAL]: require('./files/user/icon8/buying.png'),
    tags: ['buying', 'shopping'],
  },
  CAMPING: {
    value: 'camping',
    [IconSize.NORMAL]: require('./files/user/icon8/camping_tent.png'),
    tags: ['camping', 'travel'],
  },
  CANNABIS: {
    value: 'cannabis',
    [IconSize.NORMAL]: require('./files/user/icon8/cannabis.png'),
    tags: ['cannabis', 'weed', 'smoking'],
  },
  CAR: {
    value: 'car',
    [IconSize.NORMAL]: require('./files/user/icon8/car.png'),
    tags: ['car'],
  },
  CARD: {
    value: 'card',
    [IconSize.NORMAL]: require('./files/user/icon8/card_in_use.png'),
    tags: ['card', 'visa', 'money'],
  },
  CHIP: {
    value: 'chip',
    [IconSize.NORMAL]: require('./files/user/icon8/chip.png'),
    tags: ['chip', 'gambling', 'casino'],
  },
  CHOCOLATE_BAR: {
    value: 'chocolate_bar',
    [IconSize.NORMAL]: require('./files/user/icon8/chocolate_bar.png'),
    tags: ['chocolate', 'sweets'],
  },
  COFFEE: {
    value: 'coffee',
    [IconSize.NORMAL]: require('./files/user/icon8/coffee_to_go.png'),
    tags: ['coffee', 'coffeine', 'breakfast'],
  },
  COMB: {
    value: 'comb',
    [IconSize.NORMAL]: require('./files/user/icon8/comb.png'),
    tags: ['comb', 'hair', 'haircut'],
  },
  COMET: {
    value: 'comet',
    [IconSize.NORMAL]: require('./files/user/icon8/comet.png'),
    tags: ['comet'],
  },
  COOK: {
    value: 'cook',
    [IconSize.NORMAL]: require('./files/user/icon8/cook.png'),
    tags: ['cooking'],
  },
  CUPCAKE: {
    value: 'cupcake',
    [IconSize.NORMAL]: require('./files/user/icon8/cupcake.png'),
    tags: ['cupcake', 'sweets'],
  },
  DENTURE: {
    value: 'denture',
    [IconSize.NORMAL]: require('./files/user/icon8/denture.png'),
    tags: ['denture', 'teeth'],
  },
  DOCTOR: {
    value: 'doctor',
    [IconSize.NORMAL]: require('./files/user/icon8/doctor_female.png'),
    tags: ['doctor', 'health'],
  },
  DOCTORS_BAG: {
    value: 'doctors_bag',
    [IconSize.NORMAL]: require('./files/user/icon8/doctors_bag.png'),
    tags: ['doctor', 'clinic', 'disease'],
  },
  DOG: {
    value: 'dog',
    [IconSize.NORMAL]: require('./files/user/icon8/dog.png'),
    tags: ['dog', 'animal', 'pet', 'home'],
  },
  FAMILY: {
    value: 'family',
    [IconSize.NORMAL]: require('./files/user/icon8/family.png'),
    tags: ['family'],
  },
  FACIAL_MASK: {
    value: 'facial_mask',
    [IconSize.NORMAL]: require('./files/user/icon8/facial_mask.png'),
    tags: ['facial mask', 'cosmetics'],
  },
  FOLDER: {
    value: 'folder',
    [IconSize.NORMAL]: require('./files/user/icon8/folder.png'),
    tags: ['folder', 'docs'],
  },
  GAS_STATION: {
    value: 'gas_station',
    [IconSize.NORMAL]: require('./files/user/icon8/gas_station.png'),
    tags: ['gas', 'car'],
  },
  GLASSES: {
    value: 'glasses',
    [IconSize.NORMAL]: require('./files/user/icon8/glasses.png'),
    tags: ['glasses'],
  },
  HAND: {
    value: 'hand',
    [IconSize.NORMAL]: require('./files/user/icon8/hand_cursor.png'),
    tags: ['hand'],
  },
  HARD_WORKING: {
    value: 'hard_working',
    [IconSize.NORMAL]: require('./files/user/icon8/hard_working.png'),
    tags: ['work'],
  },
  HOME: {
    value: 'home',
    [IconSize.NORMAL]: require('./files/user/icon8/home.png'),
    tags: ['home'],
  },
  IDEA: {
    value: 'idea',
    [IconSize.NORMAL]: require('./files/user/icon8/idea.png'),
    tags: ['idea'],
  },
  INGREDIENTS: {
    value: 'ingredients',
    [IconSize.NORMAL]: require('./files/user/icon8/ingredients.png'),
    tags: ['ingredients'],
  },
  IMAC: {
    value: 'imac',
    [IconSize.NORMAL]: require('./files/user/icon8/imac.png'),
    tags: ['apple'],
  },
  INFO: {
    value: 'info',
    [IconSize.NORMAL]: require('./files/user/icon8/info.png'),
    tags: ['info'],
  },
  INSTAGRAM: {
    value: 'instagram',
    [IconSize.NORMAL]: require('./files/user/icon8/instagram.png'),
    tags: ['instagram', 'social'],
  },
  LAPTOP_CODING: {
    value: 'laptop_coding',
    [IconSize.NORMAL]: require('./files/user/icon8/laptop_coding.png'),
    tags: ['laptop', 'coding', 'programming'],
  },
  LOCK: {
    value: 'lock',
    [IconSize.NORMAL]: require('./files/user/icon8/lock.png'),
    tags: ['lock'],
  },
  MAINTENANCE: {
    value: 'maintenance',
    [IconSize.NORMAL]: require('./files/user/icon8/maintenance.png'),
    tags: ['maintenance', 'repair'],
  },
  MAP: {
    value: 'map',
    [IconSize.NORMAL]: require('./files/user/icon8/pittsburgh_map.png'),
    tags: ['map', 'route'],
  },
  MAP_MARKER: {
    value: 'map_marker',
    [IconSize.NORMAL]: require('./files/user/icon8/map_marker.png'),
    tags: ['map', 'location'],
  },
  MASSAGE: {
    value: 'massage',
    [IconSize.NORMAL]: require('./files/user/icon8/massage.png'),
    tags: ['massage', 'spa', 'relax'],
  },
  MEDITATION: {
    value: 'meditation',
    [IconSize.NORMAL]: require('./files/user/icon8/meditation_guru.png'),
    tags: ['meditation'],
  },
  MOVIE_PROJECTOR: {
    value: 'movie_projector',
    [IconSize.NORMAL]: require('./files/user/icon8/movie_projector.png'),
    tags: ['movie'],
  },
  MUSIC: {
    value: 'music',
    [IconSize.NORMAL]: require('./files/user/icon8/music.png'),
    tags: ['music'],
  },
  NATURAL_FOOD: {
    value: 'natural_food',
    [IconSize.NORMAL]: require('./files/user/icon8/natural_food.png'),
    tags: ['food'],
  },
  NEWS: {
    value: 'news',
    [IconSize.NORMAL]: require('./files/user/icon8/news.png'),
    tags: ['news'],
  },
  PARTY_BALOONS: {
    value: 'party_baloons',
    [IconSize.NORMAL]: require('./files/user/icon8/party_baloons.png'),
    tags: ['party'],
  },
  PILL: {
    value: 'pill',
    [IconSize.NORMAL]: require('./files/user/icon8/pill.png'),
    tags: ['pill', 'medicine'],
  },
  PIZZA: {
    value: 'pizza',
    [IconSize.NORMAL]: require('./files/user/icon8/pizza.png'),
    tags: ['pizza', 'food', 'fastfood'],
  },
  PLANET: {
    value: 'planet',
    [IconSize.NORMAL]: require('./files/user/icon8/planet.png'),
    tags: ['planet'],
  },
  RAZOR: {
    value: 'razor',
    [IconSize.NORMAL]: require('./files/user/icon8/razor.png'),
    tags: ['razor', 'shaving'],
  },
  READING: {
    value: 'reading',
    [IconSize.NORMAL]: require('./files/user/icon8/reading.png'),
    tags: ['reading', 'book'],
  },
  RENT: {
    value: 'rent',
    [IconSize.NORMAL]: require('./files/user/icon8/rent.png'),
    tags: ['rent'],
  },
  SALES: {
    value: 'sales',
    [IconSize.NORMAL]: require('./files/user/icon8/sales_performance.png'),
    tags: ['sale'],
  },
  SHOPPING_CART: {
    value: 'shopping_cart',
    [IconSize.NORMAL]: require('./files/user/icon8/shopping_cart.png'),
    tags: ['shopping', 'store'],
  },
  SHOWER: {
    value: 'shower',
    [IconSize.NORMAL]: require('./files/user/icon8/shower.png'),
    tags: ['shower'],
  },
  SKIING: {
    value: 'skiing',
    [IconSize.NORMAL]: require('./files/user/icon8/skiing.png'),
    tags: ['skiing', 'sport', 'fitness'],
  },
  SMOKING: {
    value: 'smoking',
    [IconSize.NORMAL]: require('./files/user/icon8/smoking.png'),
    tags: ['smoking'],
  },
  SPORT: {
    value: 'sport',
    [IconSize.NORMAL]: require('./files/user/icon8/sport.png'),
    tags: ['sport'],
  },
  STOPWATCH: {
    value: 'stopwatch',
    [IconSize.NORMAL]: require('./files/user/icon8/stopwatch.png'),
    tags: ['stopwatch', 'time', 'watch'],
  },
  SUBWAY: {
    value: 'subway',
    [IconSize.NORMAL]: require('./files/user/icon8/subway.png'),
    tags: ['subway', 'transport'],
  },
  SUNBATHE: {
    value: 'sunbathe',
    [IconSize.NORMAL]: require('./files/user/icon8/sunbathe.png'),
    tags: ['sunbathe', 'tan'],
  },
  SURF: {
    value: 'surf',
    [IconSize.NORMAL]: require('./files/user/icon8/surf.png'),
    tags: ['surf', 'ocean'],
  },
  SWIMMING: {
    value: 'swimming',
    [IconSize.NORMAL]: require('./files/user/icon8/swimming.png'),
    tags: ['swimming', 'sport', 'fitness'],
  },
  SYRINGE: {
    value: 'syringe',
    [IconSize.NORMAL]: require('./files/user/icon8/syringe.png'),
    tags: ['syringe', 'medicine'],
  },
  TAXI: {
    value: 'taxi',
    [IconSize.NORMAL]: require('./files/user/icon8/taxi.png'),
    tags: ['taxi'],
  },
  TEA: {
    value: 'tea',
    [IconSize.NORMAL]: require('./files/user/icon8/tea.png'),
    tags: ['tea'],
  },
  TEETH: {
    value: 'teeth',
    [IconSize.NORMAL]: require('./files/user/icon8/teeth.png'),
    tags: ['teeth'],
  },
  TOMATO: {
    value: 'tomato',
    [IconSize.NORMAL]: require('./files/user/icon8/tomato.png'),
    tags: ['tomato', 'vegetables', 'veggies'],
  },
  TREADMILL: {
    value: 'treadmill',
    [IconSize.NORMAL]: require('./files/user/icon8/treadmill.png'),
    tags: ['treadmill', 'fitness'],
  },
  TRAINERS: {
    value: 'trainers',
    [IconSize.NORMAL]: require('./files/user/icon8/trainers.png'),
    tags: ['trainers'],
  },
  TRAM: {
    value: 'tram',
    [IconSize.NORMAL]: require('./files/user/icon8/tram.png'),
    tags: ['tram', 'transport'],
  },
  TRASH: {
    value: 'trash',
    [IconSize.NORMAL]: require('./files/user/icon8/trash.png'),
    tags: ['trash'],
  },
  TREKKING: {
    value: 'trekking',
    [IconSize.NORMAL]: require('./files/user/icon8/trekking.png'),
    tags: ['trekking', 'hiking'],
  },
  VACUUM_CLEANER: {
    value: 'vacuum_cleaner',
    [IconSize.NORMAL]: require('./files/user/icon8/vacuum_cleaner.png'),
    tags: ['vacuum cleaner', 'cleaning'],
  },
  WASHING_MACHINE: {
    value: 'washing_machine',
    [IconSize.NORMAL]: require('./files/user/icon8/washing_machine.png'),
    tags: ['washing machine', 'laundry'],
  },
  WEBER: {
    value: 'weber',
    [IconSize.NORMAL]: require('./files/user/icon8/weber.png'),
    tags: ['weber'],
  },
  WED_GIFT: {
    value: 'wed_gift',
    [IconSize.NORMAL]: require('./files/user/icon8/wedding_gift.png'),
    tags: ['wedding', 'gift'],
  },
  XMAS_STOCKING: {
    value: 'xmas_stocking',
    [IconSize.NORMAL]: require('./files/user/icon8/xmas_stocking.png'),
    tags: ['xmas', 'gift'],
  },
  YOGA: {
    value: 'yoga',
    [IconSize.NORMAL]: require('./files/user/icon8/yoga.png'),
    tags: ['yoga', 'fitness', 'health'],
  },
});

export default UserIcons;
