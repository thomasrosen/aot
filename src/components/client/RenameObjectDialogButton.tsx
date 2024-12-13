"use client";

import { renameObject } from "@/actions/renameObject";
import { DialogWrapper } from "@/components/DialogWrapper";
import { Icon } from "@/components/Icon";
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
import { useRouter } from "next/navigation";
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

export function RenameObjectDialogButton({
  trigger,
  code,
  name,
}: {
  trigger: React.ReactNode;
  code: string;
  name: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    if (values.name === name) {
      toast.success("Name is already set to this value.");
      return;
    }

    const renamed = await renameObject({
      code,
      name: values.name || "",
    });

    if (renamed) {
      toast.success("Object renamed");
      setOpen(false);
      router.refresh();
    } else {
      console.error("ERROR_q89eqeAZ Failed to rename object");
      toast.error("ERROR_ChCT290a Failed to rename object");
    }
  }

  const handleCancel = useCallback(() => setOpen(false), [setOpen]);

  return (
    <DialogWrapper
      open={open}
      onOpenChange={setOpen}
      trigger={trigger || <Button>Change Name</Button>}
      title="Rename"
      description="Change the name of the object."
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="The new name…" {...field} />
                </FormControl>
                <FormDescription>The name will be public.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={handleCancel}>
              <Icon name="cancel" />
              Cancel
            </Button>
            <Button type="submit">
              <Icon name="save" />
              Save Name
            </Button>
          </div>
        </form>
      </Form>
    </DialogWrapper>
  );
}
