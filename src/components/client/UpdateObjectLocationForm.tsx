"use client";

import { createObjectHistory } from "@/actions/createObjectHistory";
import { Icon } from "@/components/Icon";
import { MapInput } from "@/components/client/MapInput";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { object_code_prefix } from "@/constants";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapRef } from "@vis.gl/react-maplibre";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { AutogrowingTextarea } from "../AutogrowingTextarea";

const validationSchema = z.object({
  code: z
    .string({
      message: "Object Code is required.",
      required_error: "Object Code is required.",
      invalid_type_error: "Object Code is required.",
    })
    .min(1, {
      message: "Object Code is required.",
    }),
  location: z.object({
    address: z
      .string({
        message: "Please enter an address.",
        required_error: "Please enter an address.",
        invalid_type_error: "Please enter an address.",
      })
      .min(1, {
        message: "Please enter an address.",
      }),
    latitude: z
      .number({
        message: "Latitude is required.",
        required_error: "Latitude is required.",
      })
      .min(-90, {
        message: "Latitude must be at least -90.",
      })
      .max(90, {
        message: "Latitude must be at most 90.",
      })
      .refine((value) => value !== null && value !== undefined, {
        message: "Latitude cannot be null or undefined.",
      })
      .refine((value) => value !== 0, {
        message: "Latitude cannot be 0.",
      }),
    longitude: z
      .number({
        message: "Longitude is required.",
        required_error: "Longitude is required.",
      })
      .min(-180, {
        message: "Longitude must be at least -180.",
      })
      .max(180, {
        message: "Longitude must be at most 180.",
      })
      .refine((value) => value !== null && value !== undefined, {
        message: "Longitude cannot be null or undefined.",
      })
      .refine((value) => value !== 0, {
        message: "Longitude cannot be 0.",
      }),
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
});

type ValidationSchemaType = z.infer<typeof validationSchema>;

export function UpdateObjectLocationForm({
  code,
  onSuccess,
  onCancel,
  className,
}: {
  code?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  className?: string;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "";

  const [isFetchingAddress, setFetchingAddress] = useState(false);
  const mapRef = useRef<MapRef>(null);

  const form = useForm({
    defaultValues: {
      code: "",
      location: {
        address: "",
        latitude: 0,
        longitude: 0,
      },
      email: "",
    },
    mode: "onSubmit",
    resolver: zodResolver(validationSchema),
  });

  const isSubmittable = !isFetchingAddress;

  const setValue = useCallback(
    (
      updateFunction: (
        data: ValidationSchemaType
      ) => Partial<ValidationSchemaType>
    ) => {
      const currentValues = form.getValues();
      const newValues = updateFunction(currentValues);
      const combinedValues = { ...currentValues, ...newValues };
      form.reset(combinedValues, {
        keepDirtyValues: false,
        keepIsValid: true,
        keepTouched: true,
      });
    },
    [form.reset, form.getValues]
  );

  useEffect(() => {
    setValue(() => ({ code: code }));
  }, [code]);

  useEffect(() => {
    setValue(() => ({ email: userEmail }));
  }, [userEmail]);

  const [address, latitude, longitude] = form.watch([
    "location.address",
    "location.latitude",
    "location.longitude",
  ]);

  const onSubmit = useCallback(
    async (values: ValidationSchemaType) => {
      try {
        const updatedLocation = await createObjectHistory({
          ...values,
          email: values.email || "",
        });

        if (updatedLocation) {
          toast.success("Location updated");
          form.reset();
          if (onSuccess) {
            onSuccess();
          }
          router.refresh();
        } else {
          toast.error("ERROR_mxjE0Q90 Failed to update location");
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error("ERROR_w6bFREER Failed to update location.", {
            description: error.message,
          });
        }
      }
    },
    [code, form.reset, router]
  );

  // Searches an address and sets coordinates accordingly
  const handleSearchByAddress = useCallback(async () => {
    try {
      setFetchingAddress(true);

      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        address
      )}&format=json&addressdetails=0&limit=1&accept-language=de,en`;

      const response = await fetch(url);
      if (!response || !response.ok) {
        throw toast.error("ERROR_QMHKSnBx Error fetching location");
      }

      const data = await response.json();
      if (data.length <= 0) {
        throw toast.error("ERROR_yDAqZc4F No data returned");
      }

      const { lat, lon, display_name, boundingbox } = data[0];

      setValue(() => ({
        location: {
          address: display_name,
          latitude: parseFloat(lat),
          longitude: parseFloat(lon),
        },
      }));

      if (mapRef.current) {
        mapRef.current.getMap().fitBounds(
          [
            [boundingbox[2], boundingbox[0]], // southwestern corner of the bounds
            [boundingbox[3], boundingbox[1]], // northeastern corner of the bounds
          ],
          {
            padding: { top: 10, bottom: 10, left: 10, right: 10 },
          }
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        return toast.error(
          `ERROR_fQMdnwcE Error fetching location: ${error.message}`
        );
      }

      toast.error("ERROR_fQMdnwcE Error fetching location");
    } finally {
      setFetchingAddress(false);
    }
  }, [address, setValue]);

  // Searches coordinates and sets address accordingly
  const handleSearchByCoords = useCallback(async () => {
    try {
      setFetchingAddress(true);

      // const currentValues = form.getValues();
      // const { latitude, longitude } = currentValues.location;

      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(
          latitude
        )}&lon=${encodeURIComponent(
          longitude
        )}&zoom=18&addressdetails=0&limit=1&accept-language=de,en`
      );

      if (!response || !response.ok) {
        throw toast.error("ERROR_YuHDZ4RX Error fetching location");
      }

      const data = await response.json();
      console.log("handleSearchByCoords-data", data);

      if (!data) {
        throw toast.error("ERROR_A4YnTEc1 No data returned");
      }

      if (data.error) {
        throw toast.error(`ERROR_eF4zu7oR ${data.error}`);
      }

      setValue((values) => {
        return {
          location: {
            ...values.location,
            address: data.display_name,
          },
        };
      });
    } catch (error) {
      if (error instanceof Error) {
        return toast.error(
          `ERROR_ESKybfq6 Error fetching location: ${error.message}`
        );
      }

      toast.error("ERROR_ESKybfq6 Error fetching location");
    } finally {
      setFetchingAddress(false);
    }
  }, [setValue, latitude, longitude]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-8", className)}
      >
        {code ? null : (
          <FormField
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Object Code</FormLabel>
                <div className="flex gap-2 items-center font-mono">
                  <span>{object_code_prefix}</span>
                  <FormControl>
                    <Input
                      className="font-mono"
                      type="text"
                      placeholder="123XYZ"
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage />
                <FormDescription>
                  The Object Code can be found on the object itself.
                </FormDescription>
              </FormItem>
            )}
          />
        )}

        <FormField
          name="location.address"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <div className="flex gap-2 items-center justify-between">
                <FormLabel>Address</FormLabel>
                <Button
                  type="button"
                  disabled={isFetchingAddress}
                  onClick={handleSearchByCoords}
                  variant="link"
                  size="sm"
                  className={cn(
                    "h-0 p-0",
                    latitude && longitude ? "visible" : "hidden invisible"
                  )}
                >
                  Fill in from coordinates
                </Button>
              </div>
              <div className="flex space-x-2">
                <FormControl>
                  <AutogrowingTextarea
                    {...field}
                    placeholder="Housenumber, Street, City, Country"
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        (async () => {
                          handleSearchByAddress();
                        })();
                      }
                    }}
                    value={address || ""}
                    onChange={field.onChange}
                  />
                </FormControl>
                <Button
                  type="button"
                  onClick={handleSearchByAddress}
                  size="icon"
                  className="shrink-0"
                >
                  <Icon name="search" />
                </Button>
              </div>
              <FormDescription>
                The address where the object is currently located. Be as more or
                less detailed as you like. This is only informative. The
                Geo-Coordinates are used when the location is needed.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-2">
          <Label>Coordinates</Label>
          <p className="text-sm text-muted-foreground">
            Click on the map to fill in location.
          </p>
          <div className="flex gap-2">
            <FormField
              name="location.latitude"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="??.???"
                      {...field}
                      onChange={(event) => {
                        const value = parseFloat(event.target.value);
                        if (value >= -90 && value <= 90) {
                          setValue((values) => ({
                            location: {
                              ...values.location,
                              latitude: value,
                            },
                          }));
                        }
                      }}
                      value={latitude || ""}
                      title="Latitude"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name="location.longitude"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="??.???"
                      {...field}
                      onChange={(event) => {
                        const value = parseFloat(event.target.value);
                        if (value >= -180 && value <= 180) {
                          setValue((values) => ({
                            location: {
                              ...values.location,
                              longitude: value,
                            },
                          }));
                        }
                      }}
                      value={longitude || ""}
                      title="Longitude"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="rounded-md h-48 overflow-hidden">
            <MapInput
              ref={mapRef}
              latitude={latitude >= -90 && latitude <= 90 ? latitude : 0}
              longitude={longitude >= -180 && longitude <= 180 ? longitude : 0}
              onClick={({ latitude, longitude }) => {
                console.log("latitude, longitude", latitude, longitude);
                setValue((values) => ({
                  location: {
                    ...values.location,
                    latitude,
                    longitude,
                  },
                }));
              }}
            />
          </div>
        </div>
        {!userEmail ? (
          // only show the email field if user is unknown. the email will be fetched from the session on the server
          <FormField
            name="email"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Your Email</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="name@email.com" {...field} />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  This email will be used to moderate your entry. It will not be
                  public.
                </FormDescription>
              </FormItem>
            )}
          />
        ) : null}
        <div className="flex gap-2 justify-end">
          {typeof onCancel === "function" ? (
            <Button type="button" variant="outline" onClick={onCancel}>
              <Icon name="cancel" />
              Cancel
            </Button>
          ) : null}
          <Button type="submit" disabled={!isSubmittable}>
            <Icon name="save" />
            Save Location
          </Button>
        </div>
      </form>
    </Form>
  );
}
