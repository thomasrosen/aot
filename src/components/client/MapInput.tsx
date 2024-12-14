"use client";

import { cn } from "@/lib/utils";
import {
  AttributionControl,
  FullscreenControl,
  GeolocateControl,
  Map,
  MapLayerMouseEvent,
  MapRef,
  Marker,
  NavigationControl,
} from "@vis.gl/react-maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import { LegacyRef, useCallback, useState } from "react";

export function MapInput({
  ref,
  longitude,
  latitude,
  zoom,
  onClick,
  className,
  children,
  onLoad,
}: {
  ref?: LegacyRef<MapRef>;
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
  children?: React.ReactNode;
  onLoad?: () => void;
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
    <>
      <Map
        ref={ref}
        {...viewState}
        onMove={(e) => setViewState(e.viewState)}
        onClick={handleClick}
        mapStyle="https://api.maptiler.com/maps/openstreetmap/style.json?key=o3zELAXbKePggwdGFWww"
        className={cn("h-full w-full", className)}
        onLoad={onLoad}
        // disable the default attribution
        attributionControl={false}
      >
        <AttributionControl compact position="bottom-right" />
        <FullscreenControl position="top-right" />
        <NavigationControl position="top-left" />
        <GeolocateControl position="top-left" />
        {longitude && latitude ? (
          <Marker longitude={longitude} latitude={latitude} color="black" />
        ) : null}
        {children}
      </Map>
      <style>{`
        .maplibregl-ctrl {
          background-color: hsl(var(--primary));
          border-radius: calc(var(--radius) - 4px);
          box-shadow: 0 0.25rem 0.5rem -0.25rem rgba(0, 0, 0, 0.5) !important;
          overflow: hidden;
        }
        .maplibregl-ctrl button {
          padding: 0.5rem;
          width: auto;
          height: auto;
        }
        .maplibregl-ctrl button .maplibregl-ctrl-icon {
          width: 1.5rem;
          height: 1.5rem;
        }
      `}</style>
    </>
  );
}
