"use client";

import { cn } from "@/lib/utils";
import { ObjectFull } from "@/types";
import { MapRef } from "@vis.gl/react-maplibre";
import { useEffect, useRef, useState } from "react";
import { CustomMarker } from "./CustomMarker";
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
          <CustomMarker
            key={`${JSON.stringify(history)}_${index}`}
            longitude={longitude}
            latitude={latitude}
            style={
              index === 0
                ? {
                    zIndex: 1,
                  }
                : undefined
            }
            className={
              index === 0
                ? " bg-green-700 size-6"
                : "bg-background size-3 shadow-[0_0_0_3px_rgba(0,0,0,0.1)] opacity-60"
            }
            onClick={() => {
              console.log("Clicked on history", history);
            }}
          >
            {index === 0 ? (
              <div
                className={cn(
                  "-z-1 absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 size-8"
                )}
              >
                <span className="animate-ping-slow absolute h-full w-full rounded-full bg-green-400"></span>
              </div>
            ) : null}
          </CustomMarker>
        );
      })}
    </MapInput>
  );
}
