"use client";

import { DialogWrapper } from "@/components/DialogWrapper";
import { GeoInput, locationFormSchema } from "@/components/client/GeoInput";
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
import { z } from "zod";

const formSchema = z.object({
  location: locationFormSchema,
  email: z.string().email({
    message: "Invalid email address.",
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { reset, formState } = form;
  const { errors } = formState;

  const onSubmit = useCallback(
    async (values: z.infer<typeof formSchema>) => {
      // Do something with the form values.
      // ✅ This will be type-safe and validated.
      console.log("onSubmit", values);

      // if (values.name === name) {
      //   toast.success("Name is already set to this value.");
      //   return;
      // }

      // const renamed = await renameObject({
      //   code,
      //   name: values.name || "",
      // });

      // if (renamed) {
      //   toast.success("Object renamed");
      // } else {
      //   toast.error("ERROR_ChCT290a Failed to rename object");
      // }

      reset();
      setOpen(false);
    },
    [code, onChange, reset]
  );

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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => {
              console.log("field", field);
              return (
                <FormItem>
                  <FormControl>
                    <GeoInput {...field} errors={errors.location} />
                  </FormControl>
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => {
              console.log("field", field);
              return (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Your Email Address"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    This is your public display name.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
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
