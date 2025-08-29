import {
  ChartNoAxesColumnIncreasing,
  List,
  Tickets,
  Users,
  Star,
  ShoppingCart,
  DollarSign,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { useTranslations } from "next-intl";
import useSWR from "swr";
import { useState, useEffect } from "react";
import { Skeleton } from "../ui/skeleton";

// Configuration for different object types
const OBJECT_CONFIGS = {
  customers: {
    endpoint: (id, dateRange) =>
      `/customers/${id}/card-analytics?date_filter[]=${dateRange[0]}&date_filter[]=${dateRange[1]}`,
    stats: (data) => [
      {
        title: "total_spend",
        value: `$${(data.total_spend || 0).toFixed(1)}`,
        icon: DollarSign,
        bgColor: "dark:from-pink-600 bg-pink-400",
      },
      {
        title: "total_purchases",
        value: data.total_purchases || 0,
        icon: ShoppingCart,
        bgColor: "bg-violet-400 dark:from-violet-900",
      },
      {
        title: "average_order_value",
        value: `$${(data.average_order_value || 0).toFixed(1)}`,
        icon: TrendingUp,
        bgColor: "dark:bg-teal-600 bg-primary",
      },
      {
        title: "redemption_rate",
        value: `${(data.redemption_rate || 0).toFixed(1)}%`,
        icon: Tickets,
        bgColor: "dark:from-blue-800 bg-blue-400",
      },
      {
        title: "last_purchase",
        value: data.last_purchase_date
          ? new Date(data.last_purchase_date).toLocaleDateString()
          : "N/A",
        icon: Clock,
        bgColor: "dark:from-cyan-700 bg-cyan-500",
      },
    ],
  },
  packages: {
    endpoint: (id, dateRange) =>
      `/packages/${id}/card-analytics?date_filter[]=${dateRange[0]}&date_filter[]=${dateRange[1]}`,
    stats: (data) => [
      {
        title: "purchased_count",
        value: data.purchased_count || 0,
        icon: ShoppingCart,
        bgColor: "dark:from-pink-600 bg-pink-400",
      },
      {
        title: "purchased_revenue",
        value: `$${(data.purchased_revenue || 0).toFixed(1)}`,
        icon: DollarSign,
        bgColor: "bg-violet-400 dark:from-violet-900",
      },
      {
        title: "redemption_rate",
        value: `${(data.redemption_rate || 0).toFixed(1)}%`,
        icon: Tickets,
        bgColor: "dark:bg-teal-600 bg-primary",
      },
      {
        title: "avg_redemption_latency",
        value: `${(data.average_redemption_latency_days || 0).toFixed(1)}d`,
        icon: Clock,
        bgColor: "dark:from-blue-800 bg-blue-400",
      },
      {
        title: "average_rating",
        value: (data.average_rating || 0).toFixed(1),
        icon: Star,
        bgColor: "dark:from-cyan-700 bg-cyan-500",
      },
    ],
  },
  providers: {
    endpoint: (id, dateRange) =>
      `/providers/${id}/card-analytics?date_filter[]=${dateRange[0]}&date_filter[]=${dateRange[1]}`,
    stats: (data) => [
      {
        title: "total_revenue",
        value: `$${(data.total_revenue || 0).toFixed(1)}`,
        icon: DollarSign,
        bgColor: "dark:from-pink-600 bg-pink-400",
      },
      {
        title: "total_purchases",
        value: data.total_purchases || 0,
        icon: ShoppingCart,
        bgColor: "bg-violet-400 dark:from-violet-900",
      },
      {
        title: "average_order_value",
        value: `$${(data.average_order_value || 0).toFixed(1)}`,
        icon: TrendingUp,
        bgColor: "dark:bg-teal-600 bg-primary",
      },
      {
        title: "unique_customers",
        value: data.unique_customers_count || 0,
        icon: Users,
        bgColor: "dark:from-blue-800 bg-blue-400",
      },
      {
        title: "average_rating",
        value: (data.average_rating || 0).toFixed(1),
        icon: Star,
        bgColor: "dark:from-cyan-700 bg-cyan-500",
      },
    ],
  },
  "coupon-types": {
    endpoint: (id, dateRange) =>
      `/coupon-types/${id}/card-analytics?date_filter[]=${dateRange[0]}&date_filter[]=${dateRange[1]}`,
    stats: (data) => [
      {
        title: "total_revenue",
        value: `$${(data.total_revenue || 0).toFixed(1)}`,
        icon: DollarSign,
        bgColor: "dark:from-pink-600 bg-pink-400",
      },
      {
        title: "total_purchases",
        value: data.total_purchases || 0,
        icon: ShoppingCart,
        bgColor: "bg-violet-400 dark:from-violet-900",
      },
      {
        title: "unique_customers",
        value: data.unique_customers_count || 0,
        icon: Users,
        bgColor: "dark:bg-teal-600 bg-primary",
      },
      {
        title: "redemption_rate",
        value: `${(data.redemption_rate || 0).toFixed(1)}%`,
        icon: Tickets,
        bgColor: "dark:from-blue-800 bg-blue-400",
      },
      {
        title: "average_rating",
        value: (data.average_rating || 0).toFixed(1),
        icon: Star,
        bgColor: "dark:from-cyan-700 bg-cyan-500",
      },
    ],
  },

  categories: {
    endpoint: (id, dateRange) =>
      `/categories/${id}/card-analytics?date_filter[]=${dateRange[0]}&date_filter[]=${dateRange[1]}`,
    stats: (data) => [
      {
        title: "total_revenue",
        value: `$${(data.total_revenue || 0).toFixed(1)}`,
        icon: DollarSign,
        bgColor: "dark:from-pink-600 bg-pink-400",
      },
      {
        title: "total_purchases",
        value: data.total_purchases || 0,
        icon: ShoppingCart,
        bgColor: "bg-violet-400 dark:from-violet-900",
      },
      {
        title: "unique_customers",
        value: data.unique_customers_count || 0,
        icon: Users,
        bgColor: "dark:bg-teal-600 bg-primary",
      },
      {
        title: "redemption_rate",
        value: `${(data.redemption_rate || 0).toFixed(1)}%`,
        icon: Tickets,
        bgColor: "dark:from-blue-800 bg-blue-400",
      },
      {
        title: "average_rating",
        value: (data.average_rating || 0).toFixed(1),
        icon: Star,
        bgColor: "dark:from-cyan-700 bg-cyan-500",
      },
    ],
  },

  coupons: {
    endpoint: (id, dateRange) =>
      `/coupons/${id}/card-analytics?date_filter[]=${dateRange[0]}&date_filter[]=${dateRange[1]}`,
    stats: (data) => [
      {
        title: "purchased_count",
        value: data.purchased_count || 0,
        icon: ShoppingCart,
        bgColor: "dark:from-pink-600 bg-pink-400",
      },
      {
        title: "purchased_revenue",
        value: `$${(data.purchased_revenue || 0).toFixed(1)}`,
        icon: DollarSign,
        bgColor: "bg-violet-400 dark:from-violet-900",
      },
      {
        title: "redemption_rate",
        value: `${(data.redemption_rate || 0).toFixed(1)}%`,
        icon: Tickets,
        bgColor: "dark:bg-teal-600 bg-primary",
      },
      {
        title: "avg_redemption_latency",
        value: `${(data.average_redemption_latency_days || 0).toFixed(1)}d`,
        icon: Clock,
        bgColor: "dark:from-blue-800 bg-blue-400",
      },
      {
        title: "average_rating",
        value: (data.average_rating || 0).toFixed(1),
        icon: Star,
        bgColor: "dark:from-cyan-700 bg-cyan-500",
      },
    ],
  },
};

export default function SalesReportCard({
  object_type,
  object_id,
  date_filter_start,
  date_filter_end,
}) {
  const t = useTranslations("SalesReport");
  const [dateRange, setDateRange] = useState([
    date_filter_start || new Date().toISOString().split("T")[0],
    date_filter_end || new Date().toISOString().split("T")[0],
  ]);

  // Update date range when props change
  useEffect(() => {
    setDateRange([
      date_filter_start || new Date().toISOString().split("T")[0],
      date_filter_end || new Date().toISOString().split("T")[0],
    ]);
  }, [date_filter_start, date_filter_end]);

  const config = OBJECT_CONFIGS[object_type];
  const { data, error, isLoading } = useSWR(
    config ? config.endpoint(object_id, dateRange) : null,
  );

  // Handle loading and error states
  if (isLoading) {
    return (
      <Card className="p-4 md:p-6 from-teal">
        <div className="flex flex-col gap-4 md:gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-primary text-xl sm:text-2xl">{t("title")}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, index) => (
              <Skeleton
                key={index}
                className="h-37 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-4 md:p-6 from-teal">
        <div className="flex flex-col gap-4 md:gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-primary text-xl sm:text-2xl">{t("title")}</h2>
            <Button variant="outline" className="w-full sm:w-auto" disabled>
              {t("export")}
            </Button>
          </div>
          <div className="text-center py-8 text-destructive">
            Failed to load data. Please try again.
          </div>
        </div>
      </Card>
    );
  }

  const statCards = data && data.data ? config.stats(data.data) : [];

  return (
    <Card className="p-4 md:p-6 ">
      <div className="flex flex-col gap-4 md:gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-primary text-xl sm:text-2xl">{t("title")}</h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className={`bg-gradient-to-l ${stat.bgColor} text-white rounded-2xl flex flex-col justify-between p-4`}
            >
              <stat.icon className="h-8 w-8 md:h-10 md:w-10" />
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
