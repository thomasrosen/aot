"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Icon } from "../Icon";

export function GeoInput({
  onChange,
}: {
  onChange?: (location: { latitude: number; longitude: number }) => void;
}) {
  const getUserLocation = async () => {
    console.log("navigator.geolocation", navigator.geolocation);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("position", position);

          const { latitude, longitude } = position.coords;
          if (onChange) {
            onChange({ latitude, longitude });
          }

          // https://nominatim.openstreetmap.org/search?q=Unter%20den%20Linden%201%20Berlin&format=json&addressdetails=1&limit=1
        },
        (error) => {
          toast.error(
            `ERROR_zjQaJsfQ Error getting location: ${error.message}`
          );
          console.error("ERROR_ePLso6bQ Error getting location:", error);
        },
        {
          enableHighAccuracy: false,
          timeout: 500, // maximum wait for the location is half a second
          // maximumAge: 0,
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  return (
    <div className="flex gap-2">
      <Button onClick={getUserLocation} size="icon" className="shrink-0">
        <Icon name="my_location" />
      </Button>
      <Input type="address" placeholder="Search for an address" />
    </div>
  );
}
