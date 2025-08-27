"use client";

import React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import useSWR from "swr";

const chartConfig = {
  total_purchases: {
    label: "Purchases",
    color: "#00cbc1",
  },
} satisfies ChartConfig;

const SalesOverviewChart = React.memo(function SalesOverviewChart() {
  const { data, error } = useSWR("/providers/charts");

  if (error) return <div>Error loading data</div>;
  if (!data) return <div>Loading...</div>;

  const chartData = data.data.purchases_summary.map((item: any) => ({
    month: item.month,
    total_purchases: item.total_purchases,
  }));

  return (
    <ChartContainer config={chartConfig} className="min-h-full w-full">
      <AreaChart accessibilityLayer data={chartData}>
        <defs>
          <linearGradient id="fillGradient" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="var(--color-total_purchases)"
              stopOpacity={0.8}
            />
            <stop
              offset="100%"
              stopColor="var(--color-total_purchases)"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
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
                return `${item?.month}`;
              }}
            />
          }
        />
        <Area
          type="monotone"
          dataKey="total_purchases"
          fill="url(#fillGradient)"
          stroke="var(--color-total_purchases)"
        />
      </AreaChart>
    </ChartContainer>
  );
});

export default SalesOverviewChart;
