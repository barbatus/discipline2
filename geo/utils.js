
const R = 6378.1;

export function getNextLatLon(lat, lon, dist, heading) {
  const lat1 = lat * (Math.PI / 180);
  const lon1 = lon * (Math.PI / 180);
  const bearing = heading * (Math.PI / 180);

  const sinLat1 = Math.sin(lat1);
  const cosLat1 = Math.cos(lat1);
  const cosDist = Math.cos(dist / R);
  const sinDist = Math.sin(dist / R);
  const lat2 = Math.asin((sinLat1 * cosDist)
    + (cosLat1 * sinDist * Math.cos(bearing)));
  const lon2 = lon1 + Math.atan2(
    Math.sin(bearing) * sinDist * cosLat1,
    cosDist - (sinLat1 * Math.sin(lat2)));
  return {
    lat: lat2 * (180 / Math.PI),
    lon: lon2 * (180 / Math.PI),
  };
}
