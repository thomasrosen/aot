"use client";

import { DialogWrapper } from "@/components/DialogWrapper";
import { useTranslations } from "@/components/client/Translation";
import { UpdateObjectLocationForm } from "@/components/client/UpdateObjectLocationForm";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function UpdateObjectLocationDialogButton({
  trigger,
  code,
}: {
  trigger: React.ReactNode;
  code: string;
}) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);

  return (
    <DialogWrapper
      open={open}
      onOpenChange={setOpen}
      trigger={trigger || <Button>{t("update-location-button")}</Button>}
      title={t("update-location-title")}
      description={t("update-location-description")}
      className="space-y-2"
    >
      <UpdateObjectLocationForm
        code={code}
        onCancel={() => setOpen(false)}
        onSuccess={() => setOpen(false)}
      />
    </DialogWrapper>
  );
}
