import { H2 } from "@/components/Typography";
import { RenameObjectDialogButton } from "@/components/client/RenameObjectDialogButton";
import { UpdateObjectLocationDialogButton } from "@/components/client/UpdateObjectLocationDialogButton";
import { object_code_prefix } from "@/constants";
import { userHasOneOfPermissions } from "@/lib/server/permissions";
import { ObjectFull } from "@/types";
import { Session } from "next-auth";
import { ObjectHistoryCard } from "../ObjectHistoryCard";
import { Badge } from "../ui/badge";

export async function ObjectViewer({
  object,
  session,
}: {
  object?: ObjectFull | null;
  session: Session | null;
}) {
  const canRenameObject = await userHasOneOfPermissions({
    userId: session?.user?.id,
    permissionNames: ["rename_objects"],
  });

  const canViewObject = await userHasOneOfPermissions({
    userId: session?.user?.id,
    permissionNames: ["view_objects"],
  });

  if (!object) {
    return null;
  }

  const { code, name } = object;

  if (!code) {
    return null;
  }

  return (
    <>
      <H2>
        <div className="flex gap-4 items-center">
          {name}
          <Badge className="whitespace-nowrap">
            {object_code_prefix}
            {code}
          </Badge>
        </div>
      </H2>
      <div className="flex gap-2">
        <UpdateObjectLocationDialogButton code={code} />

        {canRenameObject ? (
          <RenameObjectDialogButton code={code} name={name || ""} />
        ) : null}
      </div>
      {canViewObject ? (
        <div className="flex flex-col gap-4">
          {(object?.history || []).map((history) => (
            <ObjectHistoryCard key={history.id} data={history} />
          ))}
        </div>
      ) : null}
    </>
  );
}
