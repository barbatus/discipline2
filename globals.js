
global._ = require('underscore');

var getIcon = require('./icons/getIcon');
global.getIcon = getIcon;

var depot = require('./depot/depot');
global.depot = depot;

var time = require('./utils/time');
global.time = time;
