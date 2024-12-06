"use client";

import { RenameObjectDialogButton } from "@/components/RenameObjectDialogButton";
import { H2, H3 } from "@/components/Typography";
import { UpdateObjectLocationDialogButton } from "@/components/UpdateObjectLocationDialogButton";
import { object_code_prefix } from "@/constants";
import type PrismaTypes from "@prisma/client";
import { useRouter } from "next/navigation";

export function ObjectViewer({
  object,
}: {
  object?: Partial<PrismaTypes.Object> | null;
}) {
  const router = useRouter();

  if (!object) {
    return null;
  }

  const { code, name } = object;

  if (!code) {
    return null;
  }

  return (
    <>
      {name ? <H2>{name}</H2> : null}
      <H3>
        {object_code_prefix}
        {code}
      </H3>
      <div className="flex gap-2">
        <UpdateObjectLocationDialogButton
          code={code}
          onChange={() => router.refresh()}
        />

        <RenameObjectDialogButton
          code={code}
          name={name || ""}
          onChange={() => router.refresh()}
        />
      </div>
    </>
  );
}
