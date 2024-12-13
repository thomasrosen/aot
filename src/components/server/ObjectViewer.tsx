import { Icon } from "@/components/Icon";
import { ObjectHistoryCard } from "@/components/ObjectHistoryCard";
import { SubHeader } from "@/components/SubHeader";
import { RenameObjectDialogButton } from "@/components/client/RenameObjectDialogButton";
import { UpdateObjectLocationDialogButton } from "@/components/client/UpdateObjectLocationDialogButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { object_code_prefix } from "@/constants";
import { userHasOneOfPermissions } from "@/lib/server/permissions";
import { ObjectFull } from "@/types";
import { Session } from "next-auth";

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
      <SubHeader
        breadcrumb={`${object_code_prefix}${code}`}
        title={
          <>
            {name}
            <Badge className="whitespace-nowrap">
              {object_code_prefix}
              {code}
            </Badge>
          </>
        }
        actions={
          <>
            {canRenameObject ? (
              <RenameObjectDialogButton
                code={code}
                name={name || ""}
                trigger={
                  <Button variant="outline">
                    <Icon name="edit" />
                    Change Name
                  </Button>
                }
              />
            ) : null}

            <UpdateObjectLocationDialogButton
              code={code}
              trigger={
                <Button variant="default">
                  <Icon name="pin_drop" />
                  Update Location
                </Button>
              }
            />
          </>
        }
      />

      <Separator />

      {canViewObject ? (
        <div className="flex flex-col gap-4">
          {(object?.history || []).map((history) => (
            <ObjectHistoryCard key={JSON.stringify(history)} data={history} />
          ))}
        </div>
      ) : null}
    </>
  );
}
