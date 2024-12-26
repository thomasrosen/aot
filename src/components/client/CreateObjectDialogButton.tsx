"use client";

import { createObject } from "@/actions/createObject";
import { Icon } from "@/components/Icon";
import { useTranslations } from "@/components/client/Translation";
import { VaulDrawer } from "@/components/client/VaulDrawer";
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

export function CreateObjectDialogButton() {
  const router = useRouter();
  const t = useTranslations();
  const [open, setOpen] = useState(false);

  const formSchema = z.object({
    name: z
      .string()
      .min(3, {
        message: t("error-name-min-length"),
      })
      .max(100, {
        message: t("error-name-max-length"),
      }),
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const code = await createObject({
        name: values.name,
      });

      if (code) {
        toast.success(t("success-object-created"));
        setOpen(false);
        router.push(`/objects/${code}`);
      } else {
        toast.error(t("error-failed-to-create-object"));
      }
    } catch (error) {
      const isError = error instanceof Error;
      toast.error(t("error-failed-to-create-object"), {
        description: isError ? error.message : String(error),
      });
    }
  }

  const handleCancel = useCallback(() => setOpen(false), [setOpen]);

  return (
    <VaulDrawer
      open={open}
      onOpenChange={setOpen}
      trigger={
        <Button>
          <Icon name="add" />
          {t("create-object-button")}
        </Button>
      }
      title={t("create-object-title")}
      description={t("create-object-description")}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("name-label")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("name-placeholder")} {...field} />
                </FormControl>
                <FormDescription>{t("name-description")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={handleCancel}>
              <Icon name="close" />
              {t("cancel")}
            </Button>
            <Button type="submit">
              <Icon name="save" />
              {t("submit-create-object")}
            </Button>
          </div>
        </form>
      </Form>
    </VaulDrawer>
  );
}
