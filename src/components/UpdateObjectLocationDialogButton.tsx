"use client";

import { renameObject } from "@/actions/renameObject";
import { DialogWrapper } from "@/components/DialogWrapper";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Name must be at least 3 characters.",
    })
    .max(100, {
      message: "Name must be less than 100 characters.",
    }),
});

export function UpdateObjectLocationDialogButton({
  code,
  onChange,
}: {
  code: string;
  onChange?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [addressDisplayName, setAddressDisplayName] = useState<string>("");

  const getUserLocation = async () => {
    console.log("navigator.geolocation", navigator.geolocation);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });

          // https://nominatim.openstreetmap.org/search?q=Unter%20den%20Linden%201%20Berlin&format=json&addressdetails=1&limit=1
        },
        (error) => {
          toast.error(
            `ERROR_zjQaJsfQ Error getting location: ${error.message}`
          );
          console.error("ERROR_ePLso6bQ Error getting location:", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 500, // maximum wait for the location is half a second
          // maximumAge: 0,
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log("onSubmit", values);

    // if (values.name === name) {
    //   toast.success("Name is already set to this value.");
    //   return;
    // }

    const renamed = await renameObject({
      code,
      name: values.name || "",
    });

    if (renamed) {
      toast.success("Object renamed");
    } else {
      console.error("ERROR_q89eqeAZ Failed to rename object");
      toast.error("ERROR_ChCT290a Failed to rename object");
    }

    setOpen(false);
  }

  const handleCancel = useCallback(() => setOpen(false), [setOpen]);

  return (
    <DialogWrapper
      open={open}
      onOpenChange={setOpen}
      trigger={<Button>Update Location</Button>}
      title="Update Location"
      description="Update where the object is currently located."
    >
      <div className="flex gap-2">
        <Button onClick={getUserLocation}>GEO</Button>
        <Input type="address" placeholder="Search for an address" />
      </div>

      <div className="bg-gray-500 p-4 rounded-md h-48">
        <p>
          Latitude: {userLocation?.latitude || "???"}
          Longitude: {userLocation?.longitude || "???"}
        </p>
        <p>Address: {addressDisplayName || "???"}</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="The new name…" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">Save Location</Button>
          </div>
        </form>
      </Form>
    </DialogWrapper>
  );
}
