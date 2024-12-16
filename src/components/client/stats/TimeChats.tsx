"use client";

import { DatePickerWithPresets } from "@/components/client/DatePickerWithPresets";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { parseAsIsoDateTime, useQueryState } from "nuqs";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Translate, useTranslations } from "../Translation";

export function TimeChart({
  data,
  startDate: defaultStartDate,
  endDate: defaultEndDate,
  granularity: defaultGranularity,
  className,
}: {
  data: { key: string; hours: number }[];
  startDate: string;
  endDate: string;
  granularity: string;
  className?: string;
}) {
  const t = useTranslations();

  const [startDate, setStartDate] = useQueryState(
    "start",
    parseAsIsoDateTime.withDefault(new Date(defaultStartDate)).withOptions({
      clearOnDefault: false,
      shallow: false,
    })
  );
  const [endDate, setEndDate] = useQueryState(
    "end",
    parseAsIsoDateTime.withDefault(new Date(defaultEndDate)).withOptions({
      clearOnDefault: false,
      shallow: false,
    })
  );
  const [granularity, setGranularity] = useQueryState("g", {
    defaultValue: defaultGranularity,
    clearOnDefault: false,
    shallow: false,
  });

  const chartConfig = {
    hours: {
      label: "Hours",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("programming-hours-title")}</CardTitle>
        <CardDescription>
          <Translate
            id="programming-hours-description"
            elems={{
              br: <br />,
            }}
          />
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="flex gap-2">
          <DatePickerWithPresets
            className="w-full"
            from={new Date(startDate)}
            to={new Date(endDate)}
            onDateChange={(date) => {
              if (date && date.from && date.to) {
                setStartDate(date.from);
                setEndDate(date.to);
              }
            }}
          />
          <Select value={granularity} onValueChange={setGranularity}>
            <SelectTrigger>
              <SelectValue placeholder={t("granularity")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">{t("day")}</SelectItem>
              <SelectItem value="week">{t("week")}</SelectItem>
              <SelectItem value="month">{t("month")}</SelectItem>
              <SelectItem value="year">{t("year")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="key"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="hours" fill="var(--color-hours)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      {/* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */}
    </Card>
  );
}
