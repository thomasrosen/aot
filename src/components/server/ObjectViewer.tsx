import { H2, H3 } from "@/components/Typography";
import { RenameObjectDialogButton } from "@/components/client/RenameObjectDialogButton";
import { UpdateObjectLocationDialogButton } from "@/components/client/UpdateObjectLocationDialogButton";
import { object_code_prefix } from "@/constants";
import type PrismaTypes from "@prisma/client";
import { Session } from "next-auth";

export function ObjectViewer({
  object,
  session,
}: {
  object?: Partial<PrismaTypes.Object> | null;
  session: Session | null;
}) {
  const isSignedIn = !!session;
  const isMember = !!session; // session?.user?.role === "member";

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
        <UpdateObjectLocationDialogButton code={code} />

        {isSignedIn && isMember ? (
          <RenameObjectDialogButton code={code} name={name || ""} />
        ) : null}
      </div>
      {isSignedIn && isMember ? (
        <pre>{JSON.stringify(object, null, 2)}</pre>
      ) : null}
    </>
  );
}
