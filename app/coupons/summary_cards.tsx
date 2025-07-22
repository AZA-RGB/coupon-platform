import { useEffect, useState } from "react";
import { fetchCouponStats } from "./constants";
import { Card } from "@/components/ui/card";

export const SummaryCards = ({ t }) => {
  const [stats, setStats] = useState({
    activeCoupons: 0,
    monthlyReturn: "0.00",
    totalCoupons: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      const statsData = await fetchCouponStats();
      setStats(statsData);
    };
    loadStats();
  }, []);

  const summaries = [
    {
      title: t("activeCoupons"),
      value: stats.activeCoupons,
      change: "+8%",
    },
    {
      title: t("monthlyReturn"),
      value: `${stats.monthlyReturn}`,
      change: "+8%",
    },
    {
      title: t("totalCoupons"),
      value: stats.totalCoupons,
      change: "+8%",
    },
  ];

  return (
    <Card className="w-full shadow-none lg:w-4/6 p-4 hidden md:flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        {summaries.map((summary, index) => (
          <div key={index} className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <h2>{summary.title}</h2>
              <h4 className="text-2xl">{summary.value}</h4>
            </div>
            <span className="text-sm text-green-500 mt-2">
              {summary.change + " " + t("fromLastMonth")}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};

export const MobileSummaryCards = ({ t }) => {
  const [stats, setStats] = useState({
    activeCoupons: 0,
    monthlyReturn: "0.00",
    totalCoupons: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      const statsData = await fetchCouponStats();
      setStats(statsData);
    };
    loadStats();
  }, []);

  const summaries = [
    {
      title: t("activeCoupons"),
      value: stats.activeCoupons,
      change: "+8%",
    },
    {
      title: t("monthlyReturn"),
      value: `${stats.monthlyReturn}`,
      change: "+8%",
    },
    {
      title: t("totalCoupons"),
      value: stats.totalCoupons,
      change: "+8%",
    },
  ];

  return (
    <div className="flex flex-col gap-4 md:hidden">
      {summaries.map((summary, index) => (
        <Card
          key={index}
          className="w-full shadow-none p-4 flex flex-col justify-between"
        >
          <div>
            <h2>{summary.title}</h2>
            <h4 className="text-2xl">{summary.value}</h4>
          </div>
          <span className="text-sm text-green-700 mt-2">
            {" "}
            {summary.change + " " + t("fromLastMonth")}
          </span>
        </Card>
      ))}
    </div>
  );
};