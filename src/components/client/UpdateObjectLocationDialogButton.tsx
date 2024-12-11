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
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
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
    .optional(),
});

export function UpdateObjectLocationDialogButton({ object }: { object: any }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

  const [isFetchingAddress, setFetchingAddress] = useState(false);
  const [isFetchingCoordinates, setFetchingCoordinates] = useState(false);

  const code = object?.code;

  const form = useForm({
    defaultValues: useMemo(() => {
      return object?.history[0];
    }, [object]),
    mode: "all",
    resolver: zodResolver(validationSchema),
  });

  const {
    control,
    reset,
    setValue,
    watch,
    formState: { isDirty, isValid },
  } = form;

  const isFetching = isFetchingAddress || isFetchingCoordinates;
  const isSubmittable = !!isDirty && !!isValid && !isFetching;

  const [address, latitude, longitude] = watch([
    "location.address",
    "location.latitude",
    "location.longitude",
  ]);

  const onSubmit = useCallback(
    async (values: any) => {
      // Do something with the form values.
      // ✅ This will be type-safe and validated.

      const updatedLocation = await createObjectHistory({
        ...values,
        code,
      });

      if (updatedLocation) {
        toast.success("Location updated");
        reset();
        setOpen(false);
        router.refresh();
      } else {
        toast.error("ERROR_mxjE0Q90 Failed to update location");
      }
    },
    [code, reset, router]
  );

  // Used to handle current coordinates of device
  const handleFetchCoordinates = async (e: any) => {
    e.preventDefault();
    setFetchingCoordinates(true);

    if (!navigator.geolocation) {
      setFetchingCoordinates(false);
      return toast.error(
        "ERROR_LyJJy3qy Geolocation is not supported by this browser."
      );
    }

    const permission = await navigator.permissions.query({
      name: "geolocation",
    });

    if (permission.state === "denied") {
      setFetchingCoordinates(false);
      return toast.error(
        "ERROR_puxgrgGK Geolocation permission denied. Please enable it in your browser settings."
      );
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords: { latitude, longitude } }) => {
        setValue(`location.latitude`, latitude, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });

        setValue(`location.longitude`, longitude, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
      }
    );

    setFetchingCoordinates(false);
  };

  // Searches an address and sets coordinates accordingly
  const handleSearchByAddress = async (e: any) => {
    e.preventDefault();
    setFetchingAddress(true);

    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      address
    )}&format=json&addressdetails=0&limit=1&accept-language=de,en`;

    try {
      const response = await fetch(url);

      if (!response || !response.ok) {
        throw toast.error("ERROR_QMHKSnBx Error fetching location");
      }

      const data = await response.json();

      if (data.length <= 0) {
        throw toast.error("ERROR_yDAqZc4F No data returned");
      }

      const { lat, lon, display_name } = data[0];

      setValue(`location.latitude`, Number(lat), {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });

      setValue(`location.longitude`, Number(lon), {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });

      setValue(`location.address`, display_name, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
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
  };

  // Searches coordinates and sets address accordingly
  const handleSearchByCoords = async (e: any) => {
    e.preventDefault();
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

      setValue("location.address", data.display_name, {
        // shouldValidate: true, -> FOR SOME REASON; THIS MAKES LON/LAT INVALID
        shouldDirty: true,
        shouldTouch: true,
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
  };

  // Closes the dialogue modal
  const handleCancel = useCallback(() => setOpen(false), [setOpen]);

  // Safety if there's no object passed
  if (!object) return null;

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
            control={control}
            render={({ field }) => (
              <FormItem className="space-y-2">
                <div className="flex gap-2 items-center justify-between">
                  <FormLabel>Address</FormLabel>
                  {latitude && longitude ? (
                    <Button
                      disabled={isFetching}
                      onClick={handleSearchByCoords}
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
                    <AutogrowingTextarea {...field} disabled={isFetching} />
                  </FormControl>
                  <Button
                    disabled={isFetching}
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

          <div>
            <Label>Coordinates</Label>
            <p className="text-sm text-muted-foreground">
              Click on the map to fill in location.
            </p>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                {/* <Button
                  disabled={isFetching}
                  onClick={handleFetchCoordinates}
                  size="icon"
                  className="shrink-0"
                >
                  {isFetchingCoordinates ? (
                    <Icon name="hourglass" className="animate-spin" />
                  ) : (
                    <Icon name="my_location" />
                  )}
                </Button> */}

                <FormItem className="flex-1">
                  <FormLabel className="hidden">Latitude</FormLabel>
                  <FormField
                    disabled={isFetching}
                    name="location.latitude"
                    control={control}
                    render={({ field }) => (
                      <Input type="number" placeholder="??.???" {...field} />
                    )}
                  />
                  <FormMessage />
                </FormItem>

                <FormItem className="flex-1">
                  <FormLabel className="hidden">Longitude</FormLabel>
                  <FormField
                    disabled={isFetching}
                    name="location.longitude"
                    control={control}
                    render={({ field }) => (
                      <Input type="number" placeholder="??.???" {...field} />
                    )}
                  />
                  <FormMessage />
                </FormItem>
              </div>
              <div className="bg-gray-800 rounded-md h-48 overflow-hidden">
                <MapInput
                  latitude={latitude >= -90 && latitude <= 90 ? latitude : 0}
                  longitude={
                    longitude >= -180 && longitude <= 180 ? longitude : 0
                  }
                  onClick={(values) => {
                    Object.keys(values).forEach((k) =>
                      setValue(`location.${k}`, parseFloat(values[k]), {
                        shouldValidate: true,
                        shouldDirty: true,
                        shouldTouch: true,
                      })
                    );
                  }}
                />
              </div>
            </div>
          </div>

          {!userEmail && (
            <FormField
              name="email"
              control={control}
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                </FormItem>
              )}
            />
          )}

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
