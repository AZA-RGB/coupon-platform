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
    {
      billID: "#12346",
      coupon: "10% discount",
      date: "16/3/2025",
      customers: ["Lina Mahmoud"],
      price: "150",
    },
    {
      billID: "#12347",
      coupon: "free delivery",
      date: "17/3/2025",
      price: "150",
      customers: ["Youssef Ali", "Mona Hassan"],
    },
    {
      billID: "#12347",
      coupon: "free delivery",
      date: "17/3/2025",
      price: "150",
      customers: ["Youssef Ali", "Mona Hassan"],
    },
    {
      billID: "#12347",
      coupon: "free delivery",
      date: "17/3/2025",
      price: "150",
      customers: ["Youssef Ali", "Mona Hassan"],
    },
    {
      billID: "#12347",
      coupon: "free delivery",
      date: "17/3/2025",
      price: "150",
      customers: ["Youssef Ali", "Mona Hassan"],
    },
    {
      billID: "#12347",
      coupon: "free delivery",
      date: "17/3/2025",
      price: "150",
      customers: ["Youssef Ali", "Mona Hassan"],
    },
    {
      billID: "#12347",
      coupon: "free delivery",
      date: "17/3/2025",
      price: "150",
      customers: ["Youssef Ali", "Mona Hassan"],
    },
    {
      billID: "#12347",
      coupon: "free delivery",
      date: "17/3/2025",
      price: "150",
      customers: ["Youssef Ali", "Mona Hassan"],
    },
    {
      billID: "#12346",
      coupon: "free delivery",
      date: "16/3/2025",
      price: "149",
      customers: ["Youssef Ali", "Mona Hassan"],
    },
    {
      billID: "#12347",
      coupon: "free delivery",
      date: "17/3/2025",
      price: "150",
      customers: ["Youssef Ali", "Mona Hassan"],
    },
    {
      billID: "#12347",
      coupon: "free delivery",
      date: "17/3/2025",
      price: "150",
      customers: ["Youssef Ali", "Mona Hassan"],
    },
    {
      billID: "#12347",
      coupon: "free delivery",
      date: "17/3/2025",
      price: "150",
      customers: ["Youssef Ali", "Mona Hassan"],
    },
  ];
  const cardData = [
    {
      title: "Total Sales",
      value: "867,878",
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      title: "New Users",
      value: "12,345",
      icon: <Users className="h-5 w-5" />,
    },
    { title: "Orders", value: "5,678", icon: <Package className="h-5 w-5" /> },
    {
      title: "Revenue",
      value: "$89,012",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      title: "Visitors",
      value: "234,567",
      icon: <LineChart className="h-5 w-5" />,
    },
  ];
  return (
    <div className=" p-5 space-y-5">
      {/* top statistics cards */}
      <div className="h-[10vh] flex place-content-between space-x-5 ">
        {cardData.map((card, index) => (
          <Card
            key={index}
            className="flex-1 flex-row place-content-between px-4 items-center"
          >
            <div>
              <div className="text-muted-foreground">{card.title}</div>
              <div>{card.value}</div>
            </div>
            <div className="bg-primary rounded-lg p-4">{card.icon}</div>
          </Card>
        ))}
      </div>

      {/* main cards */}
      <div className="h-[35vh]  flex place-content-around space-x-5 ">
        <div className="flex-1 ">
          <CardsCarousel />
        </div>
        <div className="flex-1  ">
          <CardsCarousel />
        </div>
        <Card className="flex-1 flex items-center justify-center">
          <QRCodeComp value="https://google.com" size={200} />
        </Card>
      </div>

      {/* tables */}
      <div className="min-h-[70vh] grid grid-cols-2 space-x-5">
        <div>
          <TopProvidersTable />
        </div>

        <div>
          <TopCouponsTable></TopCouponsTable>
        </div>
      </div>
    </div>
  );
}
