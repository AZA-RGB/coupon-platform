"use client";

import React from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface PurchaseData {
  date: string;
  count: number;
}

interface Props {
  data: PurchaseData[];
}

const chartConfig = {
  count: {
    label: "Purchases",
    color: "#00cbc1",
  },
} satisfies ChartConfig;

export default React.memo(function PurchasesOverTime({ data }: Props) {
  const chartData = data.map((item) => ({
    date: item.date,
    count: item.count,
  }));

  return (
    <ChartContainer className="max-h-96 w-full" config={chartConfig}>
      <AreaChart data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(5)} // Show "MM-DD"
        />
        {/*<YAxis />*/}
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <defs>
          <linearGradient id="countGradient" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="5%"
              stopColor="var(--color-count)"
              stopOpacity={0.8}
            />
            <stop offset="95%" stopColor="var(--color-count)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="count"
          stroke="var(--color-count)"
          fill="url(#countGradient)"
          radius={10}
        />
      </AreaChart>
    </ChartContainer>
  );
});
