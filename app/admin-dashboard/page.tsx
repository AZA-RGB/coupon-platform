"use client"; // Mark the entire file as a client component due to useEffect

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchTopCategories } from "../providers/constants";
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
import TopCustomersList from "@/components/admin-dashboard/TopCustomersList";
import SalesOverviewChart from "@/components/admin-dashboard/SalesOverviewChart";
import { ProviderChart } from "@/components/admin-dashboard/ProvidersChart";
import CouponsTable from "@/components/admin-dashboard/CouponsTable";
import { useTranslations } from "next-intl";
import { EventsCarousel } from "@/components/admin-dashboard/EventsCarousel";
import { Spinner } from "@/components/ui/spinner";
import RequestsCard from "./RequestsCard";
import { useState, useEffect } from "react";
import useSWR from "swr";
import GeneralStatisticsCards from "@/components/dashboard/GeneralStatistcsCard";

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
      <GeneralStatisticsCards />

      {/* Main cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <TopCategoriesCard />
        <div className="w-full h-[35vh]">
          <EventsCarousel />
        </div>
        <div className="w-full h-[35vh]">
          <RequestsCard />
        </div>
      </div>

      {/* Sales Overview Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="lg:col-span-1 md:p-4 bg-gradient-to-b to-background">
          <CardHeader>
            <CardTitle className="text-lg">
              {t("AdminDashboard.salesOverview")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <SalesOverviewChart />
          </CardContent>
        </Card>
        <Card className="lg:col-span-1 rounded-lg bg-gradient-to-b to-background">
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
        <div className="lg:col-span-1">
          <TopCustomersList />
        </div>
      </div>
    </div>
  );
};

const TopCategoriesCard = () => {
  const t = useTranslations();
  const {
    isLoading,
    error,
    data: topCategoriesData,
  } = useSWR("/categories/top-selling-categories");

  return (
    <Card className="h-[35vh] p-4 gap-2">
      <CardTitle className="text-lg m-0">{t("Types.topCategories")}</CardTitle>
      {isLoading ? (
        <div className="flex justify-center items-center h-full">
          <Spinner />
        </div>
      ) : error ? (
        <div className="text-red-500 text-center">
          {t("Types.errorLoadingCategories") || error}
        </div>
      ) : topCategoriesData && topCategoriesData.data ? (
        <div className="overflow-auto rounded-xl">
          <Table className="min-w-full text-sm">
            <TableHeader className="bg-secondary">
              <TableRow>
                <TableHead className="py-2 px-4 text-start text-muted-foreground rtl:text-right">
                  {t("Types.rank")}
                </TableHead>
                <TableHead className="py-2 px-4 text-start text-muted-foreground rtl:text-right">
                  {t("Types.category")}
                </TableHead>
                <TableHead className="py-2 px-4 text-start text-muted-foreground rtl:text-right">
                  {t("Types.sales")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topCategoriesData.data.map((row, index) => (
                <TableRow key={index} className="hover:bg-secondary">
                  <TableCell className="py-2 px-4">{index + 1}</TableCell>
                  <TableCell className="py-2 px-4">{row.name}</TableCell>
                  <TableCell className="py-2 px-4">{row.sales_count}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="text-center">{t("Types.noData")}</div>
      )}
    </Card>
  );
};

export default AdminDashboardPage;
