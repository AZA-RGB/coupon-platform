import {
  ChartNoAxesColumnIncreasing,
  List,
  Tickets,
  Users,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { useTranslations } from "next-intl";

const STAT_CARDS = [
  {
    title: "products_sold",
    value: "50",
    icon: ChartNoAxesColumnIncreasing,
    bgColor: "dark:from-pink-600 bg-pink-400",
  },
  {
    title: "new_customers",
    value: "20",
    icon: Users,
    bgColor: "bg-violet-400 dark:from-violet-900",
  },
  {
    title: "total_orders",
    value: "300",
    icon: List,
    bgColor: "dark:bg-teal-600 bg-primary",
  },
  {
    title: "total_sales",
    value: "$1K",
    icon: ChartNoAxesColumnIncreasing,
    bgColor: "dark:from-blue-800 bg-blue-400",
  },
  {
    title: "total_coupons",
    value: "15",
    icon: Tickets,
    bgColor: "dark:from-cyan-700 bg-cyan-500",
  },
];

export default function SalesReportCard() {
  const t = useTranslations("SalesReport");

  return (
    <Card className="p-4 md:p-6 from-teal">
      <div className="flex flex-col gap-4 md:gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-primary text-xl sm:text-2xl">{t("title")}</h2>
          <Button variant="outline" className="w-full sm:w-auto">
            {t("export")}
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {STAT_CARDS.map((stat, index) => (
            <div
              key={index}
              className={`bg-gradient-to-l ${stat.bgColor}  dark:to-${stat.bgColor}   text-white rounded-2xl flex flex-col justify-between p-4`}
            >
              <stat.icon className="h-8 w-8 md:h-10 md:w-10 " />
              <div className="mt-2 md:mt-4">
                <div className="font-extrabold text-2xl md:text-3xl">
                  {stat.value}
                </div>
                <div className="text-sm md:text-base">
                  {t(`stats.${stat.title}`)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
