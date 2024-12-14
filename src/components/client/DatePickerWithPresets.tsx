"use client";

import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

export function DatePickerWithPresets({
  from = new Date(),
  to = new Date(),
  onDateChange,
  className,
}: {
  from?: Date;
  to?: Date;
  onDateChange?: (date?: DateRange) => void;
  className?: string;
}) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from,
    to,
  });

  const handleDateChange = (date?: DateRange) => {
    setDate(date);
    if (onDateChange) {
      if (date && date.from) {
        date.from.setHours(0, 0, 0, 0);
      }
      if (date && date.to) {
        date.to.setHours(23, 59, 59, 999);
      }
      onDateChange(date);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon />
          {date?.from ? (
            date?.to ? (
              <>
                {format(date.from, "y LLL dd")} - {format(date.to, "y LLL dd")}
              </>
            ) : (
              format(date.from, "y LLL dd")
            )
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
        <Select
          onValueChange={(value) => {
            if (value === "today") {
              handleDateChange({
                from: new Date(new Date().setHours(0, 0, 0, 0)),
                to: new Date(new Date().setHours(23, 59, 59, 999)),
              });
              return;
            }
            if (value === "yesterday") {
              handleDateChange({
                from: new Date(addDays(new Date(), -1).setHours(0, 0, 0, 0)),
                to: new Date(addDays(new Date(), -1).setHours(23, 59, 59, 999)),
              });
              return;
            }
            if (value === "last_week") {
              handleDateChange({
                from: addDays(new Date(), -7),
                to: new Date(),
              });
              return;
            }
            if (value === "last_month") {
              handleDateChange({
                from: addDays(new Date(), -30),
                to: new Date(),
              });
              return;
            }
            if (value === "last_year") {
              handleDateChange({
                from: addDays(new Date(), -365),
                to: new Date(),
              });
              return;
            }
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="yesterday">Yesterday</SelectItem>
            <SelectItem value="last_week">Last Week</SelectItem>
            <SelectItem value="last_month">Last Month</SelectItem>
            <SelectItem value="last_year">Last Year</SelectItem>
          </SelectContent>
        </Select>
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={date?.to || new Date()}
          selected={date}
          onSelect={handleDateChange}
          numberOfMonths={1}
        />
      </PopoverContent>
    </Popover>
  );
}
