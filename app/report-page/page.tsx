"use client";

import BillingInfo from "@/components/report-page/BillinInfo";
import Invoices from "@/components/report-page/Invoices";
import { ProfileHeader } from "@/components/report-page/ProfileHeader";
import SalesReportCard from "@/components/report-page/SalesReportCard";
import { useSearchParams } from "next/navigation";

const ReportPage = () => {
  const searchParams = useSearchParams();

  const object_type = searchParams.get("object_type");
  const object_name = searchParams.get("object_name");
  const object_id = searchParams.get("object_id");
  const date_filter_start = searchParams.get("date_filter_start");
  const date_filter_end = searchParams.get("date_filter_end");

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
        <BillingInfo />
        <Invoices />
      </div>
    </div>
  );
};

export default ReportPage;
