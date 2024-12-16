"use client";

import { Icon } from "@/components/Icon";
import { useTranslations } from "@/components/client/Translation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

export function Breadcrumbs({ children }: { children?: React.ReactNode }) {
  const t = useTranslations();
  const pathname = usePathname().split("/").filter(Boolean);
  const pathnameCount = pathname.length;

  const dictionary: Record<string, string> = {
    users: t("users"),
    objects: t("objects"),
    roles: t("roles"),
    permissions: t("permissions"),
    stats: t("statistics"),
    about: t("about"),
  };

  if (pathnameCount === 0) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            href="/"
            title={t("startpage")}
            className="inline-flex p-2 -m-2"
          >
            <Icon name="home" size="sm" />
          </BreadcrumbLink>
        </BreadcrumbItem>
        {pathname.flatMap((path, index) => {
          if (pathnameCount === index + 1) {
            return [
              <BreadcrumbSeparator key={`BreadcrumbSeparator-${index}`} />,
              <BreadcrumbItem key={`BreadcrumbItem-${index}`}>
                <BreadcrumbPage>
                  {children || dictionary[path] || path}
                </BreadcrumbPage>
              </BreadcrumbItem>,
            ];
          }

          const fullpath = `/${pathname.slice(0, index + 1).join("/")}`;
          return [
            <BreadcrumbSeparator key={`BreadcrumbSeparator-${index}`} />,
            <BreadcrumbItem key={`BreadcrumbItem-${index}`}>
              <BreadcrumbLink href={fullpath}>
                {dictionary[path] || path}
              </BreadcrumbLink>
            </BreadcrumbItem>,
          ];
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
