// alternative to using google api to calculate distance between two locations, which is not free

/**
 *
 * @param lat1
 * @param lon1
 * @param lat2
 * @param lon2
 * @returns distance between two locations in kilometers rounded to 2 decimal places
 */

export default function getDistanceBetween(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in kilometers
  return d.toFixed(2);
}

/**
 *
 * @param deg
 * @returns
 */
function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}
