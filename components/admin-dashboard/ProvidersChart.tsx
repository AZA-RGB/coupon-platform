"use client";

import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import useSWR from "swr";

const chartConfig = {
  count: {
    label: "Purchases",
    color: "#00cbc1",
  },
} satisfies ChartConfig;

export const ProviderChart = React.memo(function ProviderChart() {
  const { data, error } = useSWR("/providers/charts");

  if (error) return <div>Error loading data</div>;
  if (!data) return <div>Loading...</div>;

  const chartData = data.data.purchases_per_month.map((item: any) => ({
    month: item.month,
    count: item.count,
    provider: item.provider,
  }));

  return (
    <ChartContainer config={chartConfig} className="min-h-full w-full ">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(label, payload) => {
                const item = payload[0]?.payload;
                return `(${item?.provider})`;
              }}
            />
          }
        />
        <Bar dataKey="count" fill="var(--color-count)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
});
