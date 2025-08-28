"use client";
import useSWR from "swr";
import { Card } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { useTranslations } from "next-intl";

interface Coupon {
  id: number;
  name: string;
  description: string;
  price: string;
  amount: number;
  coupon_type_id: number;
  category_id: number;
  provider_id: number;
  date: string;
  average_rating: number;
  coupon_status: number;
  coupon_code: string;
  category: {
    id: number;
    name: string;
  };
  couponType: {
    id: number;
    name: string;
    description: string;
    status: string;
    coupons_count: number;
  };
  provider: {
    id: number;
    name: string;
    email: string;
    phone_number: string;
    role: string;
    status: string;
  };
}

interface TopCouponsResponse {
  message: string;
  data: {
    top_customers: any[]; // You can define proper types for customers if needed
    top_coupons: Coupon[];
  };
}

export default function TopCouponsTable() {
  const t = useTranslations("CouponsTable");
  const { data, error, isLoading } = useSWR<TopCouponsResponse>(
    "/coupons/top-coupons-customers",
  );

  if (error) {
    return (
      <Card className="col-span-2 grid grid-rows-6 gap-1 px-3 pt-0 h-[70vh]">
        <div className="flex items-center justify-center h-full">
          <div className="text-red-500">Error loading data</div>
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="col-span-2 grid grid-rows-6 gap-1 px-3 pt-0 h-[70vh]">
        <div className="flex items-center justify-center h-full">
          <div>Loading...</div>
        </div>
      </Card>
    );
  }

  const topCoupons = data?.data?.top_coupons || [];

  return (
    <Card className="col-span-2 grid grid-rows-6 gap-1 px-3 pt-0 h-[70vh]">
      <div className="row-span-1 flex flex-row place-content-between items-center">
        <div>
          <div className="text-2xl  ">{t("topCoupons")}</div>
          <div className="text-sm text-muted-foreground">
            {t("top10Coupons")}
          </div>
        </div>
      </div>
      <div className="row-span-5 overflow-auto">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="text-start">{t("couponName")}</TableHead>
              <TableHead className="text-start">{t("category")}</TableHead>
              <TableHead className="text-start">{t("price")}</TableHead>
              <TableHead className="text-start">{t("amount")}</TableHead>
              <TableHead className="text-start">{t("date")}</TableHead>
              <TableHead className="text-start">{t("provider")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topCoupons.map((coupon) => (
              <TableRow key={coupon.id}>
                <TableCell>{coupon.name}</TableCell>
                <TableCell>{coupon.category.name}</TableCell>
                <TableCell>{coupon.price} SAR</TableCell>
                <TableCell>{coupon.amount}</TableCell>
                <TableCell>{coupon.date}</TableCell>
                <TableCell>{coupon.provider.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
