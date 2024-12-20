type OriginalArgs = any;
// Prisma.LocationFindManyArgs & {
//   location?: { latitude: number; longitude: number; distance: number };
// };
type LocationQuery = { latitude: number; longitude: number; distance: number };

/**
 * Convert degrees to radians.
 */
function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

/**
 * Calculate the Haversine distance (in meters) between two points given by latitude/longitude.
 */
export function haversineDistance(
  from: { latitude: number; longitude: number },
  to: { latitude: number; longitude: number }
) {
  const R = 6371e3; // Earth radius in meters
  const dLat = toRad(to.latitude - from.latitude);
  const dLon = toRad(to.longitude - from.longitude);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(from.latitude)) *
      Math.cos(toRad(to.latitude)) *
      Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Apply tile-based filtering to the 'where' clause based on the provided location options.
 * This narrows down the initial results using a coarse tile-based location approximation.
 */
export function getTileFilter({
  latitude,
  longitude,
  distance,
}: {
  latitude: number;
  longitude: number;
  distance: number;
}) {
  const x = Math.floor(((longitude + 180) / 360) * (1 << 15));
  const y = Math.floor(
    ((1 -
      Math.log(Math.tan(toRad(latitude)) + 1 / Math.cos(toRad(latitude))) /
        Math.PI) /
      2) *
      (1 << 15)
  );

  const zoom = 15;
  const tileRange = Math.ceil(distance / 2);
  const maxTiles = 1 << zoom;

  const wrapAround = (value: number, max: number) =>
    ((value % max) + max) % max;

  const xMin = wrapAround(x - tileRange, maxTiles);
  const xMax = wrapAround(x + tileRange, maxTiles);
  const yMin = y - tileRange;
  const yMax = y + tileRange;

  return {
    tileY: { gte: yMin, lte: yMax },
    OR: [
      { tileX: { gte: xMin, lte: xMax } },
      {
        AND: [
          { tileX: { gte: 0, lte: xMax } },
          { tileX: { gte: xMin, lte: maxTiles - 1 } },
        ],
      },
    ],
  };
}

/**
 * Recursively apply the Haversine filtering after initial data load.
 * This function uses the current level's args to determine if location filtering applies.
 * If a location filter is present at this level and lat/lng fields are requested,
 * it filters the current level's results. It then recurses into nested includes/selects
 * with their corresponding args.
 */
export function haversineFilter(
  data: {
    latitude: number;
    longitude: number;
  },
  locationOpts: {
    latitude: number;
    longitude: number;
    distance: number;
  }
): any {
  if (!data) {
    return data;
  }

  // Check if we should filter at this level:
  if (locationOpts && data.latitude != null && data.longitude != null) {
    const { latitude, longitude, distance } = locationOpts;
    const d = haversineDistance(
      latitude,
      longitude,
      data.latitude,
      data.longitude
    );
    if (d > distance) {
      return null; // Filter out this record
    }
  }

  return data;
}
