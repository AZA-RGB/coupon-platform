"use client";

import SalesOverviewChart from "@/components/admin-dashboard/SalesOverviewChart";
import BillingInfo from "@/components/report-page/BillinInfo";
import TopThree from "@/components/report-page/Invoices";
import Invoices from "@/components/report-page/Invoices";
import { ProfileHeader } from "@/components/report-page/ProfileHeader";
import SalesReportCard from "@/components/report-page/SalesReportCard";
import { Card, CardTitle } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";

const ReportPage = () => {
  const searchParams = useSearchParams();

  const object_type = searchParams.get("object_type");
  const object_name = searchParams.get("object_name");
  const object_id = searchParams.get("object_id");
  const date_filter_start = searchParams.get("date_filter_start");
  const date_filter_end = searchParams.get("date_filter_end");
  console.log("from report page", date_filter_start);
  console.log("from report page", date_filter_end);

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
            <SalesOverviewChart />
          </Card>
          <BillingInfo
            object_type={object_type}
            object_id={object_id}
            from={date_filter_start}
            to={date_filter_end}
          />
        </div>
        {object_type === "customers" && (
          <div className="flex-col space-y-4">
            <TopThree title="Top providers by spending" />
            <TopThree title="Top categories by spending" />
            <TopThree title="Top coupons by spending" />
            <TopThree title="Top packages by spending" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportPage;
