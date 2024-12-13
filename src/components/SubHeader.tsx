import { Breadcrumbs } from "@/components/Breadcrumbs";
import { H2 } from "@/components/Typography";

export function SubHeader({
  breadcrumb,
  title,
  actions,
}: {
  breadcrumb?: string;
  title: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4">
      <Breadcrumbs>{breadcrumb}</Breadcrumbs>

      <div className="flex items-center justify-between">
        <H2 className="mb-0 flex gap-4 items-center">{title}</H2>
        <div className="flex gap-2">{actions}</div>
      </div>
    </div>
  );
}
