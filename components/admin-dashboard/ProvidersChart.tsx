"use client";

import React from "react"; // Import React
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { month: "April", desktop: 73, mobile: 190 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "April", desktop: 73, mobile: 190 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "#00cbc1",
  },
  mobile: {
    label: "Mobile",
    color: "#00cbc1",
  },
} satisfies ChartConfig;

export const ProviderChart = React.memo(function ProviderChart() {
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
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
});
