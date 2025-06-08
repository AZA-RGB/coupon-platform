import { CardsCarousel } from "@/components/dashboard/cards-carousel";
import TopCouponsTable from "@/components/dashboard/top-coupons-table";
import TopProvidersTable from "@/components/dashboard/top-providers-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  return (
    <div className=" p-5 space-y-5">
      <div className="h-[10vh] flex place-content-between space-x-5 ">
        <Card className="flex-1 flex-row place-content-between px-4 items-center">
          <div>
            <div className="text-muted-foreground"> total sales</div>
            <div>867878</div>
          </div>
          <div className="bg-primary rounded-lg p-4">icon</div>
        </Card>
        <Card className="flex-1 flex-row place-content-between px-4 items-center">
          <div>
            <div className="text-"> total sales</div>
            <div>867878</div>
          </div>
          <div className="bg-primary rounded-lg p-4">icon</div>
        </Card>
        <Card className="flex-row place-content-between px-4 items-center">
          <div>
            <div className="text-"> total sales</div>
            <div>867878</div>
          </div>
          <div className="bg-primary rounded-lg p-4">icon</div>
        </Card>
        <Card className="flex-1 flex-row place-content-between px-4 items-center">
          <div>
            <div className="text-"> total sales</div>
            <div>867878</div>
          </div>
          <div className="bg-primary rounded-lg p-4">icon</div>
        </Card>
      </div>
      <div className="h-[35vh]  flex place-content-around space-x-5 ">
        <CardsCarousel />
        <CardsCarousel />

        <Card className="flex-1"></Card>
      </div>
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
