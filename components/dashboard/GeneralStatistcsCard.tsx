import useSWR from "swr";
import { Card } from "@/components/ui/card";
import {
  Users,
  ShoppingCart,
  UserPlus,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface AnalyticsData {
  total_purchases: number;
  new_customers: number;
  registration_requests: number;
  total_revenue: number;
  total_customers: number;
}

export default function GeneralStatisticsCards() {
  const t = useTranslations("common"); // Assuming translations are under "common" namespace
  const { data, error, isLoading } = useSWR<AnalyticsData>(
    "/users/general-analytics",
  );

  if (error)
    return (
      <div>{t("GeneralStatisticsCards.Error", "Failed to load analytics")}</div>
    );
  if (isLoading)
    return <div>{t("GeneralStatisticsCards.Loading", "Loading...")}</div>;

  const cardData = [
    {
      title: t("GeneralStatisticsCards.TotalPurchases"),
      value: data?.total_purchases?.toLocaleString() || "0",
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      title: t("GeneralStatisticsCards.NewCustomers"),
      value: data?.new_customers?.toLocaleString() || "0",
      icon: <UserPlus className="h-5 w-5" />,
    },
    {
      title: t("GeneralStatisticsCards.RegistrationRequests"),
      value: data?.registration_requests?.toLocaleString() || "0",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: t("GeneralStatisticsCards.TotalRevenue"),
      value:
        `SYP ${data?.total_revenue?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` ||
        "SYP 0.00",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      title: t("GeneralStatisticsCards.TotalCustomers"),
      value: data?.total_customers?.toLocaleString() || "0",
      icon: <TrendingUp className="h-5 w-5" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cardData.map((card, index) => (
        <Card
          key={index}
          className="flex flex-row justify-between items-center p-4"
        >
          <div>
            <div className="text-muted-foreground text-sm">{card.title}</div>
            <div className="text-sm sm:text-base font-semibold">
              {card.value}
            </div>
          </div>
          <div className="bg-primary text-white rounded-lg p-3">
            {card.icon}
          </div>
        </Card>
      ))}
    </div>
  );
}
