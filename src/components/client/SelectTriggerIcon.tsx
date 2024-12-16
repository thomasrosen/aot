"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { SelectTrigger } from "../ui/select";

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
