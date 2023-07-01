const R = 6378.1;

export function getNextLatLon(lat, lon, dist, heading) {
  const lat1 = lat * (Math.PI / 180);
  const lon1 = lon * (Math.PI / 180);
  const bearing = heading * (Math.PI / 180);

  const sinLat1 = Math.sin(lat1);
  const cosLat1 = Math.cos(lat1);
  const cosDist = Math.cos(dist / R);
  const sinDist = Math.sin(dist / R);
  const lat2 = Math.asin(
    sinLat1 * cosDist + cosLat1 * sinDist * Math.cos(bearing),
  );
  const lon2 =
    lon1 +
    Math.atan2(
      Math.sin(bearing) * sinDist * cosLat1,
      cosDist - sinLat1 * Math.sin(lat2),
    );
  return {
    lat: lat2 * (180 / Math.PI),
    lon: lon2 * (180 / Math.PI),
  };
}

export function delta(lat1, lat2, lon1, lon2) {
  const dlon = (Math.PI * (lon2 - lon1)) / 180;
  const dlat = (Math.PI * (lat2 - lat1)) / 180;
  const a =
    Math.sin(dlat / 2) ** 2 +
    Math.cos((Math.PI * lat1) / 180) *
      Math.cos((Math.PI * lat2) / 180) *
      Math.sin(dlon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function approxDelta(lat1, lat2, lon1, lon2) {
  const dlon =
    Math.cos((Math.PI * lon2) / 180) - Math.cos((Math.PI * lon1) / 180);
  const dlat =
    Math.cos((Math.PI * lat2) / 180) - Math.cos((Math.PI * lat1) / 180);
  return R * Math.sqrt(dlon ** 2 + dlat ** 2);
}
