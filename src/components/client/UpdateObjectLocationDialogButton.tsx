"use client";

import { createObjectHistory } from "@/actions/createObjectHistory";
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
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  location: locationFormSchema,
  email: z.string().email({
    message: "Invalid email address.",
  }),
});

export function UpdateObjectLocationDialogButton({ code }: { code: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const userEmail = session?.user?.email;

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

          {!userEmail ? (
            // only show the email field if user is unknown. the email will be fetched from the session on the server
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
          ) : null}
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
