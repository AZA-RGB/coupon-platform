import { CardsCarousel } from "@/components/dashboard/cards-carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requestsData, topCategoriesData } from "../providers/constants";
import {
  DollarSign,
  LineChart,
  ShoppingCart,
  Users,
  Package,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import TopCustomersList from "@/components/admin-dashboard/TopCustomersList";
import SalesOverviewChart from "@/components/admin-dashboard/SalesOverviewChart";
import { ProviderChart } from "@/components/admin-dashboard/ProvidersChart";
import TopCouponsTable from "@/components/dashboard/top-coupons-table";
import CouponsTable from "@/components/admin-dashboard/CouponsTable";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import RequestReviewDialog from "@/components/RequestReviewDialog";

const AdminDashboardPage = () => {
  const t = useTranslations();
  const cardData = [
    {
      title: t("AdminDashboard.totalSales"),
      value: "867,878",
      icon: <ShoppingCart className="h-5 w-5" />,
    },
    {
      title: t("AdminDashboard.newUsers"),
      value: "12,345",
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: t("AdminDashboard.orders"),
      value: "5,678",
      icon: <Package className="h-5 w-5" />,
    },
    {
      title: t("AdminDashboard.revenue"),
      value: "$89,012",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      title: t("AdminDashboard.visitors"),
      value: "234,567",
      icon: <LineChart className="h-5 w-5" />,
    },
  ];

  return (
    <div className="p-4 sm:p-2 lg:p-4 space-y-6">
      {/* Top statistics cards */}
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

      {/* Main cards */}
      <div className=" grid grid-cols-1 lg:grid-cols-3 gap-4">
        <TopCategoriesCard />

        <div className="w-full h-[35vh] ">
          <CardsCarousel />
        </div>

        <div className="w-full h-[35vh] ">
          <RequestsCard requestsData={requestsData} />
        </div>
      </div>

      {/* Sales Overview Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="lg:col-span-1 md:p-4  bg-gradient-to-b to-background">
          <CardHeader>
            <CardTitle className="text-lg">
              {t("AdminDashboard.salesOverview")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <SalesOverviewChart />
          </CardContent>
        </Card>
        <Card className="lg:col-span-1  rounded-lg bg-gradient-to-b to-background">
          <CardTitle className="text-lg px-4">
            {t("AdminDashboard.providers")}
          </CardTitle>
          <CardContent>
            <ProviderChart />
          </CardContent>
        </Card>
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        <div className="lg:col-span-3">
          <CouponsTable />
        </div>
        <div className=" lg:col-span-1">
          <TopCustomersList />
        </div>
      </div>
    </div>
  );
};

const TopCategoriesCard = () => {
  const t = useTranslations();
  return (
    <Card className="h-[35vh] p-4 gap-2">
      <CardTitle className="  text-lg m-0">
        {t("Types.topCategories")}
      </CardTitle>
      <div className="overflow-auto  rounded-2xl">
        <Table className="min-w-full text-sm">
          <TableHeader className="bg-secondary ">
            <TableRow>
              <TableHead
                className={`py-2 px-4 text-start text-muted-foreground  rtl:text-right" : ""}`}
              >
                {t("Types.rank")}
              </TableHead>
              <TableHead
                className={`py-2 px-4 text-start text-muted-foreground  rtl:text-right" : ""}`}
              >
                {t("Types.category")}
              </TableHead>
              <TableHead
                className={`py-2 px-4 text-start text-muted-foreground  rtl:text-right" : ""}`}
              >
                {t("Types.sales")}
              </TableHead>
              <TableHead
                className={`py-2 px-4 text-start text-muted-foreground  rtl:text-right" : ""}`}
              >
                {t("Types.popularity")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topCategoriesData.slice(0, 5).map((row, index) => (
              <TableRow key={index} className="hover:bg-secondary">
                <TableCell className="py-2 px-4">{row.rank}</TableCell>
                <TableCell className="py-2 px-4">{row.category}</TableCell>
                <TableCell className="py-2 px-4">{row.sales}</TableCell>
                <TableCell className="py-2 px-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{ width: `${row.popularity}%` }}
                    ></div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

interface RequestsCardProps {
  requestsData: any[];
}

const RequestsCard = ({ requestsData }: RequestsCardProps) => {
  const t = useTranslations();
  return (
    <Card className=" h-full p-4 flex flex-col gap-2">
      <CardTitle className="flex justify-between items-center">
        <span className="text-lg  ">{t("Providers.requests")}</span>
        <Button variant="outline" className="text-sm hover:text-foreground/80">
          {t("Providers.view_all")}
        </Button>
      </CardTitle>
      <div className="overflow-auto max-h-[35vh] rounded-2xl">
        <Table className="min-w-full text-sm">
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead className="py-2 px-4 text-start text-muted-foreground">
                {t("Providers.name")}
              </TableHead>
              <TableHead className="py-2 px-4 text-center text-muted-foreground">
                {t("Providers.action")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requestsData.slice(0, 5).map((row, index) => (
              <TableRow key={index} className="hover:bg-secondary">
                <TableCell className="py-2 px-4">{row.name}</TableCell>
                <TableCell className="py-2 px-4 hidden 2xl:block ">
                  {row.requestDateTime}
                </TableCell>
                <TableCell className="py-2 px-4">
                  <div className="flex gap-2 justify-center">
                    <RequestReviewDialog />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
};

export default AdminDashboardPage;
