"use client";

import { DialogWrapper } from "@/components/DialogWrapper";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { UpdateObjectLocationForm } from "./UpdateObjectLocationForm";

export function UpdateObjectLocationDialogButton({
  trigger,
  code,
}: {
  trigger: React.ReactNode;
  code: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <DialogWrapper
      open={open}
      onOpenChange={setOpen}
      trigger={trigger || <Button>Update Location</Button>}
      title="Update Location"
      description="Update where the object is currently located."
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
