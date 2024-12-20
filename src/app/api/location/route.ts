import { getTileFilter, haversineDistance } from "@/lib/findManyExtended";
import { prisma } from "@/prisma";

export async function GET() {
  console.log("GET /api/location");

  // define the filter
  const locationForFilter = {
    latitude: 52.38,
    longitude: 13.07871896191741,
    distance: 2000, // in meters
  };

  // get rough tile filter
  const tileFilter = getTileFilter(locationForFilter);
  console.log("tileFilter", tileFilter);

  // get data
  const results = await prisma.location.findMany({
    where: { ...tileFilter },
    select: {
      id: true,
      latitude: true,
      longitude: true,
    },
  });

  // filter more precisely
  const filteredData = results
    .map((location) => ({
      ...location,

      distance: haversineDistance(locationForFilter, {
        latitude: location.latitude,
        longitude: location.longitude,
      }),
    }))
    .filter((location) => location.distance < locationForFilter.distance);
  // .sort((a, b) => a.distance - b.distance);

  // output the data
  return Response.json({
    filteredData: filteredData.length,
    results: results.length,
    tileFilter,
  });
}
