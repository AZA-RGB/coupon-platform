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

export default function Dashboard() {
  const testData = [
    {
      billID: "#12345",
      coupon: "shawarma coupon",
      date: "15/3/2025",
      customers: ["Ali Assad", "Sara Ahmed", "Omar Khalid"],
      price: "150",
    },
    // ... (rest of your test data remains the same)
  ];

  const cardData = [
    {
      title: "Total Sales",
      value: "867,878",
      icon: <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />,
    },
    {
      title: "New Users",
      value: "12,345",
      icon: <Users className="h-4 w-4 sm:h-5 sm:w-5" />,
    },
    {
      title: "Orders",
      value: "5,678",
      icon: <Package className="h-4 w-4 sm:h-5 sm:w-5" />,
    },
    {
      title: "Revenue",
      value: "$89,012",
      icon: <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />,
    },
    {
      title: "Visitors",
      value: "234,567",
      icon: <LineChart className="h-4 w-4 sm:h-5 sm:w-5" />,
    },
  ];

  return (
    <div className="p-2 sm:p-5 space-y-3 sm:space-y-5">
      {/* top statistics cards - now responsive */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-5">
        {cardData.map((card, index) => (
          <Card
            key={index}
            className="p-2 sm:p-4 flex flex-row justify-between items-center"
          >
            <div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                {card.title}
              </div>
              <div className="text-sm sm:text-base">{card.value}</div>
            </div>
            <div className="bg-primary rounded-lg p-2 sm:p-4">{card.icon}</div>
          </Card>
        ))}
      </div>

      {/* main cards - responsive layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="col-span-1 h-[35vh]">
          <CardsCarousel />
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
