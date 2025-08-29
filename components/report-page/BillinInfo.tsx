import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslations, useFormatter, useLocale } from "next-intl";
import useSWR from "swr";
import { fetcher } from "@/lib/fetcher"; // Assuming you have a pre-configured fetcher
import { Spinner } from "../ui/spinner";

interface BillingInfoProps {
  object_type: string;
  object_id: number;
  from: string;
  to: string;
}

interface Purchase {
  id: number;
  date: string;
  paid_amount: string;
  customer: {
    name: string;
  };
  provider: {
    name: string;
  };
  additionalCustomers: Array<{
    name: string;
  }>;
  purchaseCoupons: Array<{
    coupon: {
      name: string;
    };
  }>;
  purchasedItems: Array<{
    name: string;
  }>;
}

interface ApiResponse {
  data: {
    data: Purchase[];
  };
}

const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}    ${year}/${month}/${day}`;
  } catch (error) {
    return dateString; // fallback to original string if parsing fails
  }
};

export default function BillingInfo({
  object_type,
  object_id,
  from,
  to,
}: BillingInfoProps) {
  const t = useTranslations("BillingInfo");
  const format = useFormatter();
  const locale = useLocale();
  const isRTL = locale === "ar";

  // Build the API URL based on props
  const apiUrl = `/purchases/index?${object_type.slice(0, -1)}_id=${object_id}&date=${from},${to}`;
  console.log(apiUrl);
  const { data, error, isLoading } = useSWR<ApiResponse>(apiUrl);
  // if (data) console.log(data);
  return (
    <Card
      className={`md:col-span-2 col-span-1 grid grid-rows-6 gap-1 px-3 pt-0 h-[62vh] ${isRTL ? "text-right" : "text-left"}`}
    >
      <div className="row-span-1 flex flex-row place-content-between items-center">
        <div className="text-3xl ">{t("title")}</div>
      </div>
      <div className="row-span-5 overflow-auto rounded-2xl">
        {isLoading && <Spinner className="amimate-spin" />}
        {error && (
          <span className="text-destructive">couldn't load purchases</span>
        )}
        {data && (
          <Table>
            <TableHeader className="bg-muted text-accent-foreground">
              <TableRow>
                <TableHead className="rtl:text-right text-muted-foreground">
                  {t("tableHeaders.billId")}
                </TableHead>
                <TableHead className="rtl:text-right text-muted-foreground">
                  {t("tableHeaders.coupon")}
                </TableHead>
                <TableHead className="rtl:text-right text-muted-foreground">
                  {t("tableHeaders.date")}
                </TableHead>
                <TableHead className="rtl:text-right text-muted-foreground">
                  {t("tableHeaders.customers")}
                </TableHead>
                <TableHead className="rtl:text-right text-muted-foreground">
                  provider
                </TableHead>
                <TableHead className="rtl:text-right text-muted-foreground">
                  {t("price")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.data.data.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell className="font-medium">#{purchase.id}</TableCell>
                  <TableCell>
                    {purchase.purchaseCoupons?.[0]?.coupon?.name ||
                      purchase.purchasedItems?.[0]?.name ||
                      t("noCoupon")}
                  </TableCell>
                  <TableCell>{formatDate(purchase.date)}</TableCell>
                  <TableCell>
                    <div>{purchase.customer.name}</div>
                    {purchase.additionalCustomers.map((customer, index) => (
                      <div key={index}>{customer.name}</div>
                    ))}
                  </TableCell>
                  <TableCell className="text-right">
                    {purchase.provider.name}
                  </TableCell>
                  <TableCell className="text-right">
                    {purchase.paid_amount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </Card>
  );
}
