"use client";

import { createObjectHistory } from "@/actions/createObjectHistory";
import { AutogrowingTextarea } from "@/components/AutogrowingTextarea";
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
import { useTranslations } from "./Translation";

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
  const t = useTranslations();

  const validationSchema = z.object({
    code: z
      .string({
        message: t("code-required"),
        required_error: t("code-required"),
        invalid_type_error: t("code-required"),
      })
      .min(1, {
        message: t("code-required"),
      }),
    location: z.object({
      address: z
        .string({
          message: t("address-required"),
          required_error: t("address-required"),
          invalid_type_error: t("address-required"),
        })
        .min(1, {
          message: t("address-required"),
        }),
      latitude: z
        .number({
          message: t("latitude-required"),
          required_error: t("latitude-required"),
        })
        .min(-90, {
          message: t("latitude-must-be-between"),
        })
        .max(90, {
          message: t("latitude-must-be-between"),
        })
        .refine((value) => value !== null && value !== undefined, {
          message: t("latitude-must-be-number"),
        })
        .refine((value) => value !== 0, {
          message: t("latitude-can-not-zero"),
        }),
      longitude: z
        .number({
          message: t("longitude-required"),
          required_error: t("longitude-required"),
        })
        .min(-180, {
          message: t("longitude-must-be-between"),
        })
        .max(180, {
          message: t("longitude-must-be-between"),
        })
        .refine((value) => value !== null && value !== undefined, {
          message: t("longitude-must-be-number"),
        })
        .refine((value) => value !== 0, {
          message: t("longitude-can-not-zero"),
        }),
    }),
    email: z.string().email({
      message: t("email-invalid"),
    }),
  });

  type ValidationSchemaType = z.infer<typeof validationSchema>;

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
          toast.success(t("success-updated-location"));
          form.reset();
          if (onSuccess) {
            onSuccess();
          }
          router.refresh();
        } else {
          toast.error(t("error-update-location"));
        }
      } catch (error) {
        if (error instanceof Error) {
          toast.error(t("error-update-location"), {
            description: error.message,
          });
        }
      }
    },
    [code, form.reset, router, t]
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
        throw toast.error(t("error-fetching-location"));
      }

      const data = await response.json();
      if (data.length <= 0) {
        throw toast.error(t("error-fetching-location"));
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
        return toast.error(t("error-fetching-location"), {
          description: error.message,
        });
      }

      toast.error(t("error-fetching-location"));
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
        throw toast.error(t("error-fetching-location"));
      }

      const data = await response.json();

      if (!data) {
        throw toast.error(t("error-fetching-location"));
      }

      if (data.error) {
        throw toast.error(data.error);
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
        return toast.error(t("error-update-location"), {
          description: error.message,
        });
      }

      throw toast.error(t("error-fetching-location"));
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
                <FormLabel>{t("object-code")}</FormLabel>
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
                  {t("object-code-description")}
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
                <FormLabel>{t("address")}</FormLabel>
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
                  {t("fill-in-from-coordinates")}
                </Button>
              </div>
              <div className="flex space-x-2">
                <FormControl>
                  <AutogrowingTextarea
                    {...field}
                    placeholder={t("address-placeholder")}
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
                  title={t("search-address")}
                >
                  <Icon name="search" />
                </Button>
              </div>
              <FormDescription>{t("address-description")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-2">
          <Label>{t("coordinates")}</Label>
          <p className="text-sm text-muted-foreground">
            {t("coordinates-description")}
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
                      title={t("latitude")}
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
                      title={t("longitude")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="rounded-md h-48 overflow-hidden dark">
            <MapInput
              ref={mapRef}
              latitude={latitude >= -90 && latitude <= 90 ? latitude : 0}
              longitude={longitude >= -180 && longitude <= 180 ? longitude : 0}
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
                <FormLabel>{t("your-email")}</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={t("your-email-placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
                <FormDescription>{t("your-email-description")}</FormDescription>
              </FormItem>
            )}
          />
        ) : null}
        <div className="flex gap-2 justify-end">
          {typeof onCancel === "function" ? (
            <Button type="button" variant="outline" onClick={onCancel}>
              <Icon name="close" />
              {t("cancel")}
            </Button>
          ) : null}
          <Button type="submit" disabled={!isSubmittable}>
            <Icon name="save" />
            {t("save-location")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
