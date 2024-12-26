"use client";

import { ErrorPage } from "@/components/ErrorPage";
import { Icon } from "@/components/Icon";
import { ObjectHistoryCard } from "@/components/ObjectHistoryCard";
import { SubHeader } from "@/components/SubHeader";
import { H3, P } from "@/components/Typography";
import { VerticalFade } from "@/components/VerticalFade";
import { ObjectMap } from "@/components/client/ObjectMap";
import { RenameObjectDialogButton } from "@/components/client/RenameObjectDialogButton";
import { useLocale, useTranslations } from "@/components/client/Translation";
import { UpdateObjectLocationDialogButton } from "@/components/client/UpdateObjectLocationDialogButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { object_code_prefix } from "@/constants";
import { useRelations } from "@/lib/relations";
import { ObjectFull } from "@/prisma_types";

export function ViewObjectPageClient({
  code,
  canRenameObject,
}: {
  code: string;
  canRenameObject: boolean;
}) {
  const locale = useLocale();
  const t = useTranslations();

  const objects = useRelations<ObjectFull>({
    query: {
      tableName: "objects",
      include: {
        history: {
          include: {
            location: true,
            user: {
              include: {
                userRolePairings: {
                  include: {
                    role: {
                      include: {
                        rolePermissionPairings: {
                          include: {
                            permission: true,
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  const object = objects.find((object) => object.code === code);
  if (!object) {
    return <ErrorPage title={code} error={`Could not find Object "${code}"`} />;
  }

  const { name, history } = object || {};

  const firstHistory = (history || []).at(0);
  const otherHistories = (history || []).slice(1);

  const list = (
    <div className="lg:overflow-auto lg:relative">
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
            <div className="absolute bg-accent w-0.5 h-full left-1/2 -ml-0.5" />
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
    <div className="rounded-lg border overflow-hidden h-[600px] lg:h-full">
      <ObjectMap object={object} />
    </div>
  );

  return (
    <div className="lg:absolute lg:top-[64px] lg:bottom-0 lg:left-1/2 lg:right-0 lg:overflow-auto lg:grid lg:grid-rows-[auto_minmax(0,1fr)] lg:p-8 lg:pt-6 lg:pb-0 lg:w-content lg:max-w-full lg:-translate-x-1/2">
      <div className="top-16 lg:relative lg:top-0 sticky z-10 mb-8 lg:mb-0">
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
        <VerticalFade direction="top" className="block lg:hidden" />
      </div>

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
