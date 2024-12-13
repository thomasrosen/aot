"use client";

import { createObjectHistory } from "@/actions/createObjectHistory";
import { AutogrowingTextarea } from "@/components/AutogrowingTextarea";
import { DialogWrapper } from "@/components/DialogWrapper";
import { Icon } from "@/components/Icon";
import { MapInput } from "@/components/MapInput";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { MapRef } from "@vis.gl/react-maplibre";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const validationSchema = z.object({
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
      .min(-90)
      .max(90),
    longitude: z
      .number({
        message: "Longitude is required.",
        required_error: "Longitude is required.",
      })
      .min(-180)
      .max(180),
  }),
  email: z
    .string()
    .email({
      message: "Invalid email address.",
    })
    .optional()
    .or(z.literal("")),
});

type ValidationSchemaType = z.infer<typeof validationSchema>;

export function UpdateObjectLocationDialogButton({ code }: { code: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const userEmail = session?.user?.email || "";

  const [isFetchingAddress, setFetchingAddress] = useState(false);
  const mapRef = useRef<MapRef>(null);

  const form = useForm({
    defaultValues: {
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

  const {
    formState: { errors, isDirty, isValid },
  } = form;

  const isSubmittable = !!isDirty && !!isValid && !isFetchingAddress;
  console.log("errors", errors);
  console.log("isDirty", !!isDirty);
  console.log("isValid", !!isValid);
  console.log("isFetchingAddress", !isFetchingAddress);
  console.log("isSubmittable", isSubmittable);

  const setValue = useCallback(
    (updateFunction: (data: ValidationSchemaType) => ValidationSchemaType) => {
      const currentValues = form.getValues();
      const newValues = updateFunction(currentValues);
      form.reset(
        { ...form.getValues(), ...newValues },
        {
          keepDirtyValues: true,
          keepTouched: true,
        }
      );
    },
    [form.reset]
  );

  const [address, latitude, longitude] = form.watch([
    "location.address",
    "location.latitude",
    "location.longitude",
  ]);

  const onSubmit = useCallback(
    async (values: ValidationSchemaType) => {
      if (!code) {
        toast.error("ERROR_2N2ZQ3a7 Invalid object code");
        return;
      }

      const updatedLocation = await createObjectHistory({
        ...values,
        email: values.email || "",
        code,
      });

      if (updatedLocation) {
        toast.success("Location updated");
        form.reset();
        setOpen(false);
        router.refresh();
      } else {
        toast.error("ERROR_mxjE0Q90 Failed to update location");
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
      console.log("boundingbox", boundingbox);

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

      setValue(() => ({
        location: {
          address: display_name,
          latitude: Number(lat),
          longitude: Number(lon),
        },
      }));
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
  const handleSearchByCoords = useCallback(
    async ({
      latitude,
      longitude,
    }: {
      latitude: number;
      longitude: number;
    }) => {
      setFetchingAddress(true);

      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(
        latitude
      )}&lon=${encodeURIComponent(
        longitude
      )}&zoom=18&addressdetails=0&limit=1&accept-language=de,en`;

      try {
        const response = await fetch(url);

        if (!response || !response.ok) {
          throw toast.error("ERROR_YuHDZ4RX Error fetching location");
        }

        const data = await response.json();

        if (!data) {
          throw toast.error("ERROR_A4YnTEc1 No data returned");
        }

        if (data.error) {
          throw toast.error(`ERROR_eF4zu7oR ${data.error}`);
        }

        setValue((values) => ({
          location: {
            ...values.location,
            address: data.display_name,
          },
        }));
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
    },
    [setValue]
  );

  // Closes the dialogue modal
  const handleCancel = useCallback(() => setOpen(false), [setOpen]);

  return (
    <DialogWrapper
      open={open}
      onOpenChange={setOpen}
      trigger={<Button>Update Location</Button>}
      title="Update Location"
      description="Update where the object is currently located."
      className="space-y-2"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            name="location.address"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <div className="flex gap-2 items-center justify-between">
                  <FormLabel>Address</FormLabel>
                  {latitude && longitude ? (
                    <Button
                      type="button"
                      disabled={isFetchingAddress}
                      onClick={() =>
                        handleSearchByCoords({ latitude, longitude })
                      }
                      variant="link"
                      size="sm"
                      className="h-0 p-0"
                    >
                      Fill in from coordinates
                    </Button>
                  ) : null}
                </div>
                <div className="flex space-x-2">
                  <FormControl>
                    <AutogrowingTextarea
                      placeholder="Housenumber, Street, City, Country"
                      disabled={isFetchingAddress}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          (async () => {
                            handleSearchByAddress();
                          })();
                        }
                      }}
                      {...field}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    disabled={isFetchingAddress}
                    onClick={handleSearchByAddress}
                    size="icon"
                    className="shrink-0"
                  >
                    <Icon name="search" />
                  </Button>
                </div>
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
                disabled={isFetchingAddress}
                name="location.latitude"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="??.???"
                        {...field}
                        value={latitude || ""}
                        title="Latitude"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                disabled={isFetchingAddress}
                name="location.longitude"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="??.???"
                        {...field}
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
                longitude={
                  longitude >= -180 && longitude <= 180 ? longitude : 0
                }
                onClick={({ latitude, longitude }) => {
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
                    <Input
                      type="text"
                      placeholder="name@email.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    This email will be used to moderate your entry. It will not
                    be public.
                  </FormDescription>
                </FormItem>
              )}
            />
          ) : null}
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isSubmittable}>
              Save Location
            </Button>
          </div>
        </form>
      </Form>
    </DialogWrapper>
  );
}
