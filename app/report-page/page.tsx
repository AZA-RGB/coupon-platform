"use client";

import SalesOverviewChart from "@/components/admin-dashboard/SalesOverviewChart";
import BillingInfo from "@/components/report-page/BillinInfo";
import CouponsList from "@/components/report-page/CouponsList";
import TopThree from "@/components/report-page/Invoices";
import Invoices from "@/components/report-page/Invoices";
import { ProfileHeader } from "@/components/report-page/ProfileHeader";
import PurchasesOverTime from "@/components/report-page/PurchasesOverTime";
import PurchaseTypeBreakdown from "@/components/report-page/PurchaseTypeBreakdown";
import RatingDistribution from "@/components/report-page/RatingDistributions";
import SalesReportCard from "@/components/report-page/SalesReportCard";
import TopCategories from "@/components/report-page/TopCategories";
import TopProvidersByRevenue from "@/components/report-page/TopProvidersByRevenue";
import { Badge } from "@/components/ui/badge";
import { Card, CardTitle } from "@/components/ui/card";
import {
  AtSignIcon,
  BoxesIcon,
  DollarSign,
  Phone,
  PhoneCall,
  UserRound,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
const purchaseData = {
  coupon: {
    count: 0,
    amount: 0,
  },
  package: {
    count: 1,
    amount: 1964.06,
  },
};
const ReportPage = () => {
  const searchParams = useSearchParams();

  const object_type = searchParams.get("object_type");
  const object_name = searchParams.get("object_name");
  const object_id = searchParams.get("object_id");
  const date_filter_start = searchParams.get("date_filter_start");
  const date_filter_end = searchParams.get("date_filter_end");
  const reportURL = `/${object_type}/${object_id}/report?date[]=${date_filter_start}&date[]=${date_filter_end}`;
  const { data: reportData, isLoading, error } = useSWR(reportURL);
  if (reportData) {
    console.log(reportData.data);
  }
  return (
    <div className="px-6 mb-6 gap-4">
      <ProfileHeader name={object_name} />
      <SalesReportCard
        object_type={object_type}
        object_id={object_id}
        date_filter_start={date_filter_start}
        date_filter_end={date_filter_end}
      />
      <div className="grid grid-cols-1  md:grid-cols-3 gap-4  mt-4 ">
        <div className="flex-col  col-span-2 gap-4">
          <Card className="lg:col-span-1 rounded-lg bg-gradient-to-t to-background px-3 pb-1 mb-3">
            <CardTitle className="text-2xl px-3">purchase over time</CardTitle>
            {reportData && (
              <PurchasesOverTime
                data={reportData.data.purchases.purchases_over_time}
              />
            )}
          </Card>
          <BillingInfo
            object_type={object_type}
            object_id={object_id}
            from={date_filter_start}
            to={date_filter_end}
          />
        </div>
        {reportData && (
          <div>
            {object_type === "customers" && (
              <div className="flex-col space-y-4 ">
                <Card className="flex-col space-between flex-1 p-4 items-center ">
                  <CardTitle className="text-xl text-primary">
                    Contanct
                  </CardTitle>
                  <Card className="flex-1  flex-row-reverse  p-3 items-center">
                    <AtSignIcon size={30} className=" " />
                    <div className=" text-xl">
                      {reportData.data.customer.user.email}
                    </div>
                  </Card>
                  <Card className="flex-1  flex-row-reverse  p-3 items-center">
                    <Phone size={30} className=" " />
                    <div className="font-semibold text-xl">
                      {reportData.data.customer.user.phone}
                    </div>
                  </Card>
                </Card>
                <TopProvidersByRevenue
                  top_providers_by_revenue={
                    reportData.data.mix.top_providers_by_spend
                  }
                />
                <CouponsList
                  title="Top coupons by spending"
                  coupons={reportData.data.mix.top_coupons_by_purchases}
                />
                <TopCategories
                  top_categories_by_spend={
                    reportData.data.mix.top_categories_by_spend
                  }
                />
              </div>
            )}
            {object_type === "categories" && (
              <div className="flex-col space-y-4">
                <RatingDistribution ratings={reportData.data.ratings} />
                <TopProvidersByRevenue
                  top_providers_by_revenue={
                    reportData.data.providers.top_providers_by_revenue
                  }
                />
              </div>
            )}
            {object_type === "providers" && (
              <div className="flex-col space-y-4">
                <PurchaseTypeBreakdown
                  data={reportData.data.purchases.purchase_type_breakdown}
                />
                <RatingDistribution ratings={reportData.data.ratings} />
              </div>
            )}
            {object_type === "coupons" && (
              <div className="flex-col space-y-4">
                <Card className="flex-row space-between flex-1 p-4 ">
                  <Card className="flex-1 items-center gap-3">
                    <UserRound size={100} className="mx-auto mb-1" />
                    <div className="font-semibold text-xl">
                      {reportData.data.coupon.provider_name}
                    </div>
                    <Badge className=" font-bold">
                      {reportData.data.coupon.category_name}
                    </Badge>
                  </Card>
                  <Card className="flex-1 items-center gap-3">
                    <DollarSign size={100} className="mx-auto mb-1" />
                    <div className="font-semibold text-xl">
                      {reportData.data.coupon.price}
                    </div>
                    <Badge className=" font-bold"></Badge>
                  </Card>
                </Card>
                <RatingDistribution ratings={reportData.data.ratings} />
              </div>
            )}
            {object_type === "packages" && (
              <div className="flex-col space-y-4">
                <CouponsList
                  title="Coupons includede"
                  coupons={reportData.data.package.included_coupons}
                />
                <RatingDistribution ratings={reportData.data.ratings} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportPage;
