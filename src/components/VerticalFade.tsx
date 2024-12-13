import { cn } from "@/lib/utils";

function OneFade({
  direction = "top",
  className,
}: {
  direction?: "top" | "bottom";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "verticalFade h-8",
        direction === "top" ? "top -mb-8" : "bottom -mt-8",
        className
      )}
    />
  );
}

export function VerticalFade({
  direction,
  className,
}: {
  direction?: "top" | "bottom";
  className?: string;
}) {
  return (
    <>
      <div
        className={cn(
          "pointer-events-none",
          "sticky z-2 w-full",
          direction === "top" ? "top-0 -mb-8" : "bottom-0 -mt-8",
          className
        )}
      >
        <OneFade
          className="[--fade:1px][--fade-background:transparent]"
          direction={direction}
        />
        <OneFade
          className="[--fade:1px][--fade-background:transparent]"
          direction={direction}
        />
        <OneFade
          className="[--fade:2px][--fade-background:transparent]"
          direction={direction}
        />
        <OneFade
          className="[--fade:2px][--fade-background:transparent]"
          direction={direction}
        />
        <OneFade className="[--fade:3px]" direction={direction} />
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            .verticalFade {
              --fade-background: hsl(var(--background));
              position: sticky;
              pointer-events: none;
              -webkit-user-select: none;
              -moz-user-select: none;
              user-select: none;
              width: 100%;
              left: 0;
              -webkit-backdrop-filter: blur(var(--fade, 1px));
              backdrop-filter: blur(var(--fade, 1px));
              will-change: transform;
            }
            .verticalFade.top {
              top: 0;
              background: linear-gradient(
                to bottom,
                var(--fade-background) 0%,
                transparent 25%
              );
              -webkit-mask-image: linear-gradient(to bottom, black 0%, transparent);
              mask-image: linear-gradient(to bottom, black 0%, transparent);
            }
            .verticalFade.bottom {
              bottom: 0;
              background: linear-gradient(
                to top,
                var(--fade-background) 0%,
                transparent 25%
              );
              -webkit-mask-image: linear-gradient(to top, black 0%, transparent);
              mask-image: linear-gradient(to top, black 0%, transparent);
            }
          `,
        }}
      />
    </>
  );
}
