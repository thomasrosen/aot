import { cn } from "@/lib/utils";

export function MainFrame({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"main">) {
  return <main className={cn("p-2", className)} {...props} />;
}
