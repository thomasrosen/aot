import { Breadcrumbs } from "@/components/Breadcrumbs";
import { H2 } from "@/components/Typography";
import { cn } from "@/lib/utils";

export function SubHeader({
  breadcrumb,
  title,
  actions,
  className,
}: {
  breadcrumb?: string;
  title: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "sticky top-[64px] bg-background text-foreground flex flex-col gap-4 py-6 -mt-6",
        className
      )}
    >
      <Breadcrumbs>{breadcrumb}</Breadcrumbs>

      <div className="flex items-center justify-between flex-wrap gap-4">
        <H2 className="mb-0 flex gap-4 items-center flex-wrap">{title}</H2>
        <div className="flex gap-2 flex-wrap">{actions}</div>
      </div>
    </div>
  );
}
