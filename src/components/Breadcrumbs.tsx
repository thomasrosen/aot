"use client";

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
  const pathname = usePathname().split("/").filter(Boolean);
  const pathnameCount = pathname.length;
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        {pathname.flatMap((path, index) => {
          if (pathnameCount === index + 1) {
            return [
              <BreadcrumbSeparator key={`BreadcrumbSeparator-${index}`} />,
              <BreadcrumbItem key={`BreadcrumbItem-${index}`}>
                <BreadcrumbPage>{children || path}</BreadcrumbPage>
              </BreadcrumbItem>,
            ];
          }

          const fullpath = `/${pathname.slice(0, index + 1).join("/")}`;
          return [
            <BreadcrumbSeparator key={`BreadcrumbSeparator-${index}`} />,
            <BreadcrumbItem key={`BreadcrumbItem-${index}`}>
              <BreadcrumbLink href={fullpath}>{path}</BreadcrumbLink>
            </BreadcrumbItem>,
          ];
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
