"use client";

import { SelectTrigger } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import React from "react";

export const SelectTriggerIcon = React.forwardRef<
  React.ElementRef<typeof SelectTrigger>,
  React.ComponentPropsWithoutRef<typeof SelectTrigger>
>(({ className, children, ...props }, ref) => (
  <SelectTrigger
    ref={ref}
    className={cn("w-auto shrink-0 gap-2", className)}
    {...props}
  >
    {children}
  </SelectTrigger>
));
SelectTriggerIcon.displayName = SelectTrigger.displayName;
