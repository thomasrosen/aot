"use client";

import { ObjectFull } from "@/types";
import { Marker } from "@vis.gl/react-maplibre";
import { MapInput } from "./MapInput";

export function ObjectMap({ object }: { object?: ObjectFull }) {
  return (
    <MapInput>
      {(object?.history || []).map((history) => {
        const latitude = history.location?.latitude;
        const longitude = history.location?.longitude;
        return (
          <Marker longitude={longitude} latitude={latitude} color="black" />
        );
      })}
    </MapInput>
  );
}
