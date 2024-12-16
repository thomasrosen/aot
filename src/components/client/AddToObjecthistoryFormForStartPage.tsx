"use client";

import { SubHeader } from "@/components/SubHeader";
import { useTranslations } from "@/components/client/Translation";
import { UpdateObjectLocationForm } from "@/components/client/UpdateObjectLocationForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export function AddToObjecthistoryFormForStartPage() {
  const t = useTranslations();
  const [successAlterIsOpen, setSuccessAlterIsOpen] = useState(false);
  return (
    <>
      <div className="w-96 max-w-full mx-auto">
        <SubHeader title={t("update-location")} />
        <UpdateObjectLocationForm
          onCancel={undefined}
          onSuccess={() => setSuccessAlterIsOpen(true)}
        />
      </div>
      <AlertDialog
        open={successAlterIsOpen}
        onOpenChange={setSuccessAlterIsOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("location-updated")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("location-updated-description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>{t("okay")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
