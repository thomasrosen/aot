"use client";

import { Icon } from "@/components/Icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Ref, useCallback, useEffect, useState } from "react";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

export const locationFormSchema = z.object({
  address: z
    .string({
      message: "Please enter an address.",
      required_error: "Please enter an address.",
      invalid_type_error: "Please enter an address.",
    })
    .min(1, {
      message: "Please enter an address.",
    }),
  latitude: z.number({
    message: "Latitude is required.",
    required_error: "Latitude is required.",
    invalid_type_error: "Latitude must be a number",
  }),
  longitude: z.number({
    message: "Longitude is required.",
    required_error: "Longitude is required.",
    invalid_type_error: "Longitude must be a number",
  }),
});
type LocationFormSchemaType = z.infer<typeof locationFormSchema>;

function FakeFormItem({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>;
}

function ErrorMessage({ error }: { error?: string }) {
  if (!error) {
    return null;
  }
  return <div className="text-red-500 text-xs">{error}</div>;
}

type GeoData =
  | {
      address?: string;
      latitude?: number;
      longitude?: number;
    }
  | undefined;

export function GeoInput({
  onChange,
  value,
  errors,
}: {
  name?: string;
  onBlur?: () => void;
  onChange?: (data: GeoData) => void;
  ref?: Ref<HTMLInputElement>;
  value?: GeoData;
  errors?:
    | Merge<FieldError, FieldErrorsImpl<LocationFormSchemaType>>
    | undefined;
}) {
  const [fetchingCurrentGeoCoordinates, setFetchingCurrentGeoCoordinates] =
    useState(false);

  const [isAutocorrectingAddress, setIsAutocorrectingAddress] = useState(false);
  const [isAutofillingAddress, setIsAutofillingAddress] = useState(false);
  const [isAutofillingGeo, setIsAutofillingGeo] = useState(false);

  const [address, setAddress] = useState<string | undefined>(undefined);

  const [latitude, setLatitude] = useState<number | undefined>(undefined);
  const [longitude, setLongitude] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (onChange) {
      onChange({
        address,
        latitude,
        longitude,
      });
    }
  }, [onChange, address, latitude, longitude]);

  useEffect(() => {
    setAddress(value?.address ? value.address : undefined);
    setLatitude(value?.latitude ? value.latitude : undefined);
    setLongitude(value?.longitude ? value.longitude : undefined);
  }, [value]);

  const searchByGeoLocation = useCallback(
    async (location?: { latitude: number; longitude: number }) => {
      const latitude_tmp = location?.latitude || latitude;
      const longitude_tmp = location?.longitude || longitude;

      if (!latitude_tmp || !longitude_tmp) {
        return;
      }
      setIsAutofillingAddress(true);

      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(
        latitude_tmp
      )}&lon=${encodeURIComponent(
        longitude_tmp
      )}&zoom=18&addressdetails=0&limit=1&accept-language=de,en`;

      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          if (data) {
            if (data.error) {
              toast.error(`ERROR_eF4zu7oR ${data.error}`);
            } else if (data.display_name) {
              setAddress(data.display_name);
            }
          } else {
            toast.error("ERROR_A4YnTEc1 No data returned");
          }
        } else {
          toast.error("ERROR_YuHDZ4RX Error fetching location");
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(
            `ERROR_ESKybfq6 Error fetching location: ${error.message}`
          );
        } else {
          toast.error("ERROR_ESKybfq6 Error fetching location");
        }
      } finally {
        setIsAutofillingAddress(false);
      }
    },
    [latitude, longitude, setIsAutofillingAddress]
  );
  const getUserLocation = useCallback(async () => {
    setFetchingCurrentGeoCoordinates(true);

    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (permissionStatus) {
          if (permissionStatus.state === "denied") {
            toast.error(
              "ERROR_puxgrgGK Geolocation permission denied. Please enable it in your browser settings."
            );
            return;
          }

          navigator.geolocation.getCurrentPosition(
            function (position) {
              setLatitude(position.coords.latitude);
              setLongitude(position.coords.longitude);

              searchByGeoLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            },
            (error) => {
              toast.error(
                `ERROR_uY5fSuNA Error getting location: ${error.message}`
              );
            },
            {
              enableHighAccuracy: true,
              timeout: 500, // maximum wait for the location is half a second
              maximumAge: 60000, // cache the location for 60 seconds
            }
          );
        })
        .finally(() => {
          setFetchingCurrentGeoCoordinates(false);
        });
    } else {
      setFetchingCurrentGeoCoordinates(false);
      toast.error(
        "ERROR_LyJJy3qy Geolocation is not supported by this browser."
      );
    }
  }, [
    searchByGeoLocation,
    setLatitude,
    setLongitude,
    setFetchingCurrentGeoCoordinates,
  ]);

  const searchByAddress = useCallback(
    async ({
      canSetAddress,
      canSetGeo,
    }: {
      canSetAddress: boolean;
      canSetGeo: boolean;
    }) => {
      if (!address) {
        return;
      }
      if (canSetAddress) {
        setIsAutocorrectingAddress(true);
      }
      if (canSetGeo) {
        setIsAutofillingGeo(true);
      }

      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        address
      )}&format=json&addressdetails=0&limit=1&accept-language=de,en`;

      try {
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          if (data.length > 0) {
            const { lat, lon, display_name } = data[0];
            if (canSetGeo) {
              setLatitude(parseFloat(lat));
              setLongitude(parseFloat(lon));
            }
            if (canSetAddress) {
              setAddress(display_name);
            }
          } else {
            toast.error("ERROR_yDAqZc4F No data returned");
          }
        } else {
          toast.error("ERROR_QMHKSnBx Error fetching location");
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(
            `ERROR_fQMdnwcE Error fetching location: ${error.message}`
          );
        } else {
          toast.error("ERROR_fQMdnwcE Error fetching location");
        }
      } finally {
        setIsAutocorrectingAddress(false);
        setIsAutofillingGeo(false);
      }
    },
    [
      address,
      setLatitude,
      setLongitude,
      setIsAutocorrectingAddress,
      setIsAutofillingGeo,
    ]
  );

  return (
    <div className="space-y-8">
      <FakeFormItem>
        <Label
          className={cn(errors?.address?.message ? "text-destructive" : null)}
        >
          Address{" "}
          {latitude && longitude ? (
            <Button
              type="button"
              variant="link"
              size="sm"
              className="h-auto"
              onClick={() => searchByGeoLocation()}
            >
              Fill in from Geo Location
              {isAutofillingAddress ? " (Searching...)" : null}
            </Button>
          ) : null}
        </Label>
        <div className="flex gap-2">
          <Textarea
            placeholder="The full address"
            value={address || ""}
            onChange={(e) => setAddress(e.target.value)}
          />
          {address ? (
            <Button
              type="button"
              onClick={() =>
                searchByAddress({
                  canSetAddress: true,
                  canSetGeo: true,
                })
              }
              size="icon"
              className="shrink-0"
            >
              {isAutocorrectingAddress ? (
                <Icon name="hourglass" className="animate-spin" />
              ) : (
                <Icon name="search" />
              )}
            </Button>
          ) : null}
        </div>
        <ErrorMessage error={errors?.address?.message} />
      </FakeFormItem>

      <FakeFormItem>
        <Label
          className={cn(
            errors?.latitude?.message || errors?.longitude?.message
              ? "text-destructive"
              : null
          )}
        >
          Geo Location (Latitude / Longitude){" "}
          {address ? (
            <Button
              type="button"
              variant="link"
              size="sm"
              className="h-auto"
              onClick={() =>
                searchByAddress({
                  canSetAddress: false,
                  canSetGeo: true,
                })
              }
            >
              Fill in from Address
              {isAutofillingGeo ? " (Searching...)" : null}
            </Button>
          ) : null}
        </Label>
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={getUserLocation}
            size="icon"
            className="shrink-0"
          >
            {fetchingCurrentGeoCoordinates ? (
              <Icon name="hourglass" className="animate-spin" />
            ) : (
              <Icon name="my_location" />
            )}
          </Button>
          <Input
            type="number"
            placeholder="??.???"
            value={latitude || ""}
            onChange={(e) =>
              setLatitude(
                e.target.value ? parseFloat(e.target.value) : undefined
              )
            }
          />
          <Input
            type="number"
            placeholder="??.???"
            value={longitude || ""}
            onChange={(e) =>
              setLongitude(
                e.target.value ? parseFloat(e.target.value) : undefined
              )
            }
          />
        </div>
        <ErrorMessage error={errors?.latitude?.message} />
        <ErrorMessage error={errors?.longitude?.message} />
        <div className="bg-gray-800 p-4 rounded-md h-48">
          <pre className="text-xs text-white whitespace-pre-wrap">
            TODO: show and choose location on Map
            <br />
            <br />
            Latitude: {latitude}
            <br />
            Longitude: {longitude}
            <br />
            Address: {address}
          </pre>
        </div>
      </FakeFormItem>
    </div>
  );
}
