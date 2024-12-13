"use client";

import { cn } from "@/lib/utils";
import {
  FullscreenControl,
  GeolocateControl,
  Map,
  MapLayerMouseEvent,
  Marker,
  NavigationControl,
} from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { useCallback, useState } from "react";

export function MapInput({
  longitude,
  latitude,
  zoom,
  onClick,
  className,
}: {
  longitude?: number;
  latitude?: number;
  zoom?: number;
  onClick?: ({
    longitude,
    latitude,
  }: {
    longitude: number;
    latitude: number;
  }) => void;
  className?: string;
}) {
  const [viewState, setViewState] = useState({
    latitude: latitude || 50,
    longitude: longitude || 10,
    zoom: zoom || 1,
  });

  const handleClick = useCallback(
    (event: MapLayerMouseEvent) => {
      if (onClick) {
        const { lngLat } = event;
        onClick({
          longitude: lngLat.lng,
          latitude: lngLat.lat,
        });
      }
    },
    [onClick]
  );

  return (
    <Map
      {...viewState}
      onMove={(e) => setViewState(e.viewState)}
      onClick={handleClick}
      mapStyle="https://api.maptiler.com/maps/basic-v2/style.json?key=o3zELAXbKePggwdGFWww" // TODO how can we hide the api key?
      className={cn("h-full w-full", className)}
      cursor="pointer"
    >
      <FullscreenControl position="top-left" />
      <NavigationControl />
      <GeolocateControl />
      {longitude && latitude ? (
        <Marker longitude={longitude} latitude={latitude} color="red" />
      ) : null}
    </Map>
  );
}
