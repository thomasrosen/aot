"use client";

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
import { SubHeader } from "../SubHeader";
import { UpdateObjectLocationForm } from "./UpdateObjectLocationForm";

export function AddToObjecthistoryFormForStartPage() {
  const [successAlterIsOpen, setSuccessAlterIsOpen] = useState(false);
  return (
    <>
      <div className="w-96 max-w-full mx-auto">
        <SubHeader title="Update Location" />
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
            <AlertDialogTitle>Location Updated</AlertDialogTitle>
            <AlertDialogDescription>
              The location of the object was successfully updated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Okay</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
