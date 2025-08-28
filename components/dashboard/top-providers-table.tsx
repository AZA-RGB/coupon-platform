"use client";
import useSWR from "swr";
import PurchasesOverTime from "../report-page/PurchasesOverTime";
import { Button } from "../ui/button";
import { Card, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useTranslations } from "next-intl";
import Cookies from "js-cookie";
import { report } from "process";
import { Spinner } from "../ui/spinner";
import PurchaseTypeBreakdown from "../report-page/PurchaseTypeBreakdown";
import RatingDistribution from "../report-page/RatingDistributions";

export default function TopProvidersTable() {
  const t = useTranslations();
  const today = new Date();
  const lastYear = new Date(
    today.getFullYear() - 1,
    today.getMonth(),
    today.getDate(),
  );
  const reportURL = `/providers/${Cookies.get("id")}/report?date[]=${lastYear.toISOString().split("T")[0]}&date[]=${today.toISOString().split("T")[0]}`;
  const { data: reportData, isLoading, error } = useSWR(reportURL);

  return (
    <div className="flex flex-col lg:flex-row gap-4 ">
      <Card className="bg-gradient-to-b to-background grid grid-rows-6 gap-1 px-4 py-6 max-h-[70vh] w-full lg:w-2/3">
        <CardTitle>
          <div className="text-xl sm:text-xl text-primary">
            {t("AdminDashboard.salesOverview")}
          </div>
        </CardTitle>
        <div className="row-span-5 overflow-auto">
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <Spinner className="animate-spin" />
            </div>
          )}
          {error && (
            <div className="flex items-center justify-center h-full text-destructive text-sm sm:text-base">
              {t("common.errorLoadingData")}
            </div>
          )}
          {reportData && (
            <PurchasesOverTime
              data={reportData.data.purchases.purchases_over_time}
            />
          )}
        </div>
      </Card>
      {reportData && (
        <div className="flex flex-col gap-4 w-full lg:w-1/3">
          <PurchaseTypeBreakdown
            data={reportData.data.purchases.purchase_type_breakdown}
          />
          <RatingDistribution ratings={reportData.data.ratings} />
        </div>
      )}
    </div>
  );
}
