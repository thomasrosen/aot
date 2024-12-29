"use client";

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

export function ChangeObjectTypeDialogButton({
  trigger,
  code,
  type,
}: {
  trigger: React.ReactNode;
  code: string;
  type: string;
}) {
  const router = useRouter();
  const t = useTranslations();
  const [open, setOpen] = useState(false);

  const formSchema = z.object({
    type: z.string(),
  });

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.type === type) {
      toast.success(t("success-type-is-same"));
      return;
    }

    const changedType = await updateObjectType({
      code,
      type: values.type || "",
    });

    if (changedType) {
      toast.success(t("success-type-updated"));
      setOpen(false);
      router.refresh();
    } else {
      console.error(t("error-failed-to-change-type"));
      toast.error(t("error-failed-to-change-type"));
    }
  }

  const handleCancel = useCallback(() => setOpen(false), [setOpen]);

  return (
    <VaulDrawer
      open={open}
      onOpenChange={setOpen}
      trigger={trigger || <Button>{t("change-type-button")}</Button>}
      title={t("change-type-title")}
      description={t("change-type-description")}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("type-label")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("type-placeholder")} {...field} />
                </FormControl>
                <FormDescription>{t("type-description")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-2 justify-end flex-wrap">
            <Button type="button" variant="outline" onClick={handleCancel}>
              <Icon name="close" />
              {t("cancel")}
            </Button>
            <Button type="submit">
              <Icon name="save" />
              {t("save-type")}
            </Button>
          </div>
        </form>
      </Form>
    </VaulDrawer>
  );
}
