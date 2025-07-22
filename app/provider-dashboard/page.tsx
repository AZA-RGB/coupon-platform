import { EventsCarousel } from "@/components/admin-dashboard/EventsCarousel";
import { CardsCarousel } from "@/components/dashboard/cards-carousel";
import QRCodeComp from "@/components/dashboard/QR-code";
import TopCouponsTable from "@/components/dashboard/top-coupons-table";
import TopProvidersTable from "@/components/dashboard/top-providers-table";
import { Card } from "@/components/ui/card";
import {
  DollarSign,
  LineChart,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function Dashboard() {
  const t = useTranslations();

  // const testData = [
  //   {
  //     billID: "#12345",
  //     coupon: "shawarma coupon",
  //     date: "15/3/2025",
  //     customers: ["Ali Assad", "Sara Ahmed", "Omar Khalid"],
  //     price: "150",
  //   },
  //   // ... (rest of your test data remains the same)
  // ];

  const cardData = [
    {
      title: t("AdminDashboard.totalSales"),
      value: "867,878",
      icon: <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />,
    },
    {
      title: t("AdminDashboard.newUsers"),
      value: "12,345",
      icon: <Users className="h-4 w-4 sm:h-5 sm:w-5" />,
    },
    {
      title: t("AdminDashboard.orders"),
      value: "5,678",
      icon: <Package className="h-4 w-4 sm:h-5 sm:w-5" />,
    },
    {
      title: t("AdminDashboard.revenue"),
      value: "$89,012",
      icon: <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />,
    },
    {
      title: t("AdminDashboard.visitors"),
      value: "234,567",
      icon: <LineChart className="h-4 w-4 sm:h-5 sm:w-5" />,
    },
  ];

  return (
    <div className="p-2 sm:p-5 space-y-3 sm:space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cardData.map((card, index) => (
          <Card
            key={index}
            className="flex flex-row justify-between items-center p-4"
          >
            <div>
              <div className="text-muted-foreground text-sm">{card.title}</div>
              <div className="text-sm sm:text-base">{card.value}</div>
            </div>
            <div className="bg-primary text-white rounded-lg p-3">
              {card.icon}
            </div>
          </Card>
        ))}
      </div>

      {/* main cards - responsive layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-1 h-[35vh]">
          <EventsCarousel />
        </div>
        <div className="h-[35vh]  ">
          <CardsCarousel />
        </div>
        <Card className="flex-1 flex items-center justify-center p-4 ">
          <QRCodeComp value="https://google.com" size={180} />
        </Card>
      </div>

      {/* tables - responsive layout */}
      <div className="flex flex-col lg:flex-row gap-3 sm:gap-5">
        <div className="lg:w-1/2">
          <TopProvidersTable />
        </div>
        <div className="lg:w-1/2">
          <TopCouponsTable />
        </div>
      </div>
    </div>
  );
}
