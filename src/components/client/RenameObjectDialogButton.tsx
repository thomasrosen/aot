"use client";

import { renameObject } from "@/actions/renameObject";
import { DialogWrapper } from "@/components/DialogWrapper";
import { Icon } from "@/components/Icon";
import { useTranslations } from "@/components/client/Translation";
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
      name,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.name === name) {
      toast.success(t("success-name-is-same"));
      return;
    }

    const renamed = await renameObject({
      code,
      name: values.name || "",
    });

    if (renamed) {
      toast.success(t("success-name-updated"));
      setOpen(false);
      router.refresh();
    } else {
      console.error(t("error-failed-to-rename-object"));
      toast.error(t("error-failed-to-rename-object"));
    }
  }

  const handleCancel = useCallback(() => setOpen(false), [setOpen]);

  return (
    <DialogWrapper
      open={open}
      onOpenChange={setOpen}
      trigger={trigger || <Button>{t("change-name-button")}</Button>}
      title={t("change-name-title")}
      description={t("change-name-description")}
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
              {t("save-name")}
            </Button>
          </div>
        </form>
      </Form>
    </DialogWrapper>
  );
}
