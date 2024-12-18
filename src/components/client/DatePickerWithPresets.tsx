"use client";

import { addDays } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";

import { useLocale, useTranslations } from "@/components/client/Translation";
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
import { formatDate, formatDateRange } from "@/lib/formatDate";
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
  const t = useTranslations();
  const locale = useLocale();

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
              formatDateRange(date.from, date.to, locale)
            ) : (
              formatDate(date.from, locale)
            )
          ) : (
            <span>{t("date-range-picker-placeholder")}</span>
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
            <SelectValue placeholder={t("date-range-picker-placeholder")} />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="today">{t("today")}</SelectItem>
            <SelectItem value="yesterday">{t("yesterday")}</SelectItem>
            <SelectItem value="last_week">{t("last-week")}</SelectItem>
            <SelectItem value="last_month">{t("last-month")}</SelectItem>
            <SelectItem value="last_year">{t("last-year")}</SelectItem>
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
