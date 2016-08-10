'use strict';

// Radius of the earth in km.
const R = 6371;

export function getDistanceFromLatLonInMeters(lat1, lon1, lat2, lon2) {
  let dLat = deg2rad(lat2 - lat1);
  let dLon = deg2rad(lon2 - lon1);
  let a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let d = R * c;

  return d * 1000;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
