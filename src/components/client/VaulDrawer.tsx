"use client";

import { Icon } from "@/components/Icon";
import { H2 } from "@/components/Typography";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Drawer } from "vaul";
import { VerticalFade } from "../VerticalFade";

export function VaulDrawer({
  trigger,
  title,
  description,
  children,
  ...props
}: {
  trigger: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
} & React.ComponentProps<typeof Drawer.Root>) {
  return (
    <Drawer.Root {...props} modal={true}>
      {trigger ? <Drawer.Trigger asChild>{trigger}</Drawer.Trigger> : null}
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-50 backdrop-blur-sm lg:backdrop-blur bg-background/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-1000 ease-in-expo" />
        <Drawer.Content
          className={cn(
            "drop-shadow-2xl",
            "h-fit w-fit sm:p-4",
            "sm:w-full sm:h-full sm:flex sm:items-center sm:justify-center",
            "bottom-0 left-0 z-50 fixed mx-auto right-0 outline-none",
            "duration-1000 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]",
            "ease-in-expo",
            "!pointer-events-none"
          )}
        >
          <div
            className={cn(
              "w-full max-h-screen max-w-[100vw] rounded-2xl sm:w-[600px] sm:max-h-[calc(80vh-2rem)] sm:max-w-[calc(100vw-2rem)] bg-background text-foreground dark:border relative pointer-events-auto overflow-auto"
            )}
          >
            {/* <div className="relative sm:hidden -top-3 z-10">
              <Drawer.Handle />
            </div> */}
            <div className="sticky top-0 h-0 left-0 right-0 z-20">
              {/* 
                <Drawer.Close asChild>
                  <div className="sm:hidden z-10 absolute left-1/2 mx-auto mt-4 -ml-[30px] w-12 h-1.5 rounded-full bg-muted cursor-pointer hover:bg-destructive transition-colors" />
                </Drawer.Close>
              */}

              <Drawer.Close asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="z-10 absolute top-1 right-1 h-8 w-8 rounded-sm text-muted-foreground"
                >
                  <Icon name="close" size="sm" />
                </Button>
              </Drawer.Close>
            </div>

            <div className="sticky top-0 -mb-8">
              <VerticalFade direction="top" classNameFade="h-32 -mb-32" />
              <div className="p-8 z-10 relative bg-gradient-to-b from-background via-background">
                <Drawer.Title asChild>
                  <H2 className="m-0">{title}</H2>
                </Drawer.Title>
                {description ? (
                  <Drawer.Description className="text-muted-foreground text-sm">
                    {description}
                  </Drawer.Description>
                ) : null}
              </div>
            </div>

            <div className="p-8">{children}</div>
            <VerticalFade direction="bottom" />
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
