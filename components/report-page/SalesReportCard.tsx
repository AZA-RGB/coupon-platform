import {
  ChartNoAxesColumnIncreasing,
  List,
  Tickets,
  Users,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";

const STAT_CARDS = [
  {
    title: "Total sales",
    value: "$1K",
    icon: ChartNoAxesColumnIncreasing,
    bgColor: "blue-500",
  },
  {
    title: "Total orders",
    value: "300",
    icon: List,
    bgColor: "[#FF947A]",
  },
  {
    title: "Products sold",
    value: "50",
    icon: ChartNoAxesColumnIncreasing,
    bgColor: "[#3CD856]",
  },
  {
    title: "New customers",
    value: "20",
    icon: Users,
    bgColor: "[#BF83FF]",
  },
  {
    title: "Total coupons",
    value: "15",
    icon: Tickets,
    bgColor: "[#4FD1C5]",
  },
];

export default function SalesReportCard() {
  return (
    <Card className="p-4 md:p-6">
      <div className="flex flex-col gap-4 md:gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-primary text-xl sm:text-2xl">Sales Report</h2>
          <Button variant="outline" className="w-full sm:w-auto">
            Export
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {STAT_CARDS.map((stat, index) => (
            <div
              key={index}
              className={` bg-${stat.bgColor} dark:saturate-100 rounded-2xl text-white flex flex-col justify-between p-4`}
            >
              <stat.icon className="h-8 w-8 md:h-10 md:w-10 " />
              <div className="mt-2 md:mt-4">
                <div className="font-extrabold text-2xl md:text-3xl">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base">{stat.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
