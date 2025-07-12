"use client";

import BillingInfo from "@/components/report-page/BillinInfo";
import Invoices from "@/components/report-page/Invoices";
import { ProfileHeader } from "@/components/report-page/ProfileHeader";
import SalesReportCard from "@/components/report-page/SalesReportCard";

const ReportPage = () => {
  return (
    <div className="px-6 mb-6 gap-4">
      <ProfileHeader />
      <SalesReportCard />
      <div className="grid grid-cols-1  md:grid-cols-3 gap-4  mt-4 ">
        <BillingInfo />
        <Invoices />
      </div>
    </div>
  );
};

export default ReportPage;
