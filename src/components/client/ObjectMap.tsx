"use client";

import { ObjectFull } from "@/types";
import { MapRef, Marker } from "@vis.gl/react-maplibre";
import { useEffect, useRef, useState } from "react";
import { MapInput } from "./MapInput";

function getBounds(points: { latitude: number; longitude: number }[]) {
  const lats = points.map((point) => point.latitude);
  const lngs = points.map((point) => point.longitude);

  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);

  return [
    [minLng, minLat],
    [maxLng, maxLat],
  ];
}

export function ObjectMap({ object }: { object?: ObjectFull }) {
  const mapRef = useRef<MapRef>(null);
  const [mapReady, setMapReady] = useState(false);

  const points = (object?.history || [])
    .map((history) => {
      const latitude = history.location?.latitude;
      const longitude = history.location?.longitude;
      return { latitude, longitude };
    })
    .filter((point) => point.latitude && point.longitude) as {
    latitude: number;
    longitude: number;
  }[];
  const pointsJson = JSON.stringify(points);

  const initialFitBoundsDone = useRef(false);
  useEffect(() => {
    if (mapReady && mapRef.current) {
      const map = mapRef.current.getMap();
      if (map) {
        const points = JSON.parse(pointsJson);
        map.fitBounds(getBounds(points), {
          padding: 100,
          maxZoom: 15,
          animate: initialFitBoundsDone.current,
        });
        initialFitBoundsDone.current = true;
      }
    }
  }, [pointsJson, mapReady]);

  return (
    <MapInput
      ref={mapRef}
      onLoad={
        // Trigger fitBounds when the map is ready
        () => setMapReady(true)
      }
    >
      {(object?.history || []).map((history, index) => {
        const latitude = history.location?.latitude;
        const longitude = history.location?.longitude;
        return (
          <Marker
            key={JSON.stringify(history)}
            longitude={longitude}
            latitude={latitude}
            color={index === 0 ? "#0f0" : "black"}
          />
        );
      })}
    </MapInput>
  );
}
