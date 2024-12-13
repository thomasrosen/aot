import { cn } from "@/lib/utils";

export function MainFrame({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"main">) {
  return (
    <main className={cn("flex-1 space-y-4 p-8 pt-6", className)} {...props} />
  );
}
