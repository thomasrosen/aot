import { auth } from "@/auth";
import { Icon } from "@/components/Icon";
import { ObjectHistoryCard } from "@/components/ObjectHistoryCard";
import { SubHeader } from "@/components/SubHeader";
import { H3, P } from "@/components/Typography";
import { VerticalFade } from "@/components/VerticalFade";
import { ObjectMap } from "@/components/client/ObjectMap";
import { RenameObjectDialogButton } from "@/components/client/RenameObjectDialogButton";
import { UpdateObjectLocationDialogButton } from "@/components/client/UpdateObjectLocationDialogButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { object_code_prefix } from "@/constants";
import { loadTranslations } from "@/lib/server/fluent-server";
import { getObject } from "@/lib/server/getObject";
import { userHasOneOfPermissions } from "@/lib/server/permissions";
import { Locale } from "@@/i18n-config";
import { notFound } from "next/navigation";

export default async function ViewObjectPage({
  params,
}: {
  params: Promise<{
    locale: Locale;
    code: string;
  }>;
}) {
  const { code, locale } = await params;
  const t = await loadTranslations(locale);

  if (!code) {
    return null;
  }

  const session = await auth();
  const isAllowed = await userHasOneOfPermissions({
    userId: session?.user?.id,
    permissionNames: ["view_objects"],
  });
  if (!isAllowed) {
    throw new Error("Not allowed");
  }

  const object = await getObject({ code });
  if (!object || !object.code) {
    return notFound();
  }

  const canRenameObject = await userHasOneOfPermissions({
    userId: session?.user?.id,
    permissionNames: ["rename_objects"],
  });

  const { name } = object;

  const firstHistory = (object?.history || []).at(0);
  const otherHistories = (object?.history || []).slice(1);

  const list = (
    <div className="overflow-auto relative">
      <VerticalFade direction="top" />

      {!firstHistory && !otherHistories.length ? (
        <P>{t("no-location-entries")}</P>
      ) : null}

      {firstHistory ? (
        <>
          <H3 className="mt-8 mb-4">{t("current-location")}</H3>
          <ObjectHistoryCard
            key={JSON.stringify(firstHistory)}
            data={firstHistory}
            locale={locale}
          />
        </>
      ) : null}

      {otherHistories.length > 0 ? (
        <>
          <H3 className="mt-8 mb-4">{t("past-locations")}</H3>
          <div className="flex flex-col gap-4 relative">
            <div className="absolute bg-accent w-1 h-full left-1/2 -ml-0.5" />
            {otherHistories.map((history) => (
              <ObjectHistoryCard
                key={JSON.stringify(history)}
                data={history}
                className="z-1"
                locale={locale}
              />
            ))}
          </div>
        </>
      ) : null}

      <div className="pb-48" />
      <VerticalFade direction="bottom" />
    </div>
  );
  const map = (
    <div className="rounded-lg border overflow-hidden h-full">
      <ObjectMap object={object} />
    </div>
  );

  return (
    <div className="lg:absolute lg:top-[64px] lg:bottom-0 lg:left-0 lg:right-0 lg:overflow-auto lg:grid lg:grid-rows-[auto_minmax(0,1fr)] lg:p-8 lg:pt-6 lg:pb-0">
      <SubHeader
        className="relative top-0"
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
                    {t("rename-object")}
                  </Button>
                }
              />
            ) : null}

            <UpdateObjectLocationDialogButton
              code={code}
              trigger={
                <Button variant="default">
                  <Icon name="pin_drop" />
                  {t("update-location")}
                </Button>
              }
            />
          </>
        }
      />

      <div className="block lg:hidden lg:h-full">
        <Tabs
          defaultValue="list"
          // className="grid grid-rows-[auto_minmax(0,1fr)] h-full"
        >
          <div>
            <TabsList>
              <TabsTrigger value="list" className="gap-2">
                <Icon name="list" />
                {t("list")}
              </TabsTrigger>
              <TabsTrigger value="map" className="gap-2">
                <Icon name="map" />
                {t("map")}
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="list">{list}</TabsContent>
          <TabsContent value="map">{map}</TabsContent>
        </Tabs>
      </div>
      <div className="hidden lg:grid grid-cols-2 gap-4">
        {list}
        {map}
      </div>
    </div>
  );
}
