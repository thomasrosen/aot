"use client";

import { Icon } from "@/components/Icon";
import { useGlobalStore } from "@/components/client/GlobalStoreProvider";
import { cn } from "@/lib/utils";

export function MainFrame({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"main">) {
  const { _hasHydrated } = useGlobalStore();

  return (
    <main
      className={cn(
        "flex-1 space-y-4 p-8 pt-6 w-content max-w-full mx-auto",
        className
      )}
      {...props}
    >
      {_hasHydrated ? (
        children
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center h-full w-full"
          title="Loading…"
        >
          <Icon
            name="progress_activity"
            className="animate-spin w-12 h-12 text-5xl"
            size="lg"
          />
        </div>
      )}
    </main>
  );
}
