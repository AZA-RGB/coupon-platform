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

const testData = [
  {
    billID: "#12345",
    coupon: "shawarma coupon",
    date: "15/3/2025",
    customers: ["Ali Assad", "Sara Ahmed", "Omar Khalid"],
    price: "150",
  },
  {
    billID: "#12346",
    coupon: "10% discount",
    date: "16/3/2025",
    customers: ["Lina Mahmoud"],
    price: "150",
  },
  {
    billID: "#12347",
    coupon: "free delivery",
    date: "17/3/2025",
    price: "150",
    customers: ["Youssef Ali", "Mona Hassan"],
  },
  {
    billID: "#12347",
    coupon: "free delivery",
    date: "17/3/2025",
    price: "150",
    customers: ["Youssef Ali", "Mona Hassan"],
  },
  {
    billID: "#12347",
    coupon: "free delivery",
    date: "17/3/2025",
    price: "150",
    customers: ["Youssef Ali", "Mona Hassan"],
  },
  {
    billID: "#12347",
    coupon: "free delivery",
    date: "17/3/2025",
    price: "150",
    customers: ["Youssef Ali", "Mona Hassan"],
  },
  {
    billID: "#12347",
    coupon: "free delivery",
    date: "17/3/2025",
    price: "150",
    customers: ["Youssef Ali", "Mona Hassan"],
  },
  {
    billID: "#12347",
    coupon: "free delivery",
    date: "17/3/2025",
    price: "150",
    customers: ["Youssef Ali", "Mona Hassan"],
  },
  {
    billID: "#12347",
    coupon: "free delivery",
    date: "17/3/2025",
    price: "150",
    customers: ["Youssef Ali", "Mona Hassan"],
  },
  {
    billID: "#12347",
    coupon: "free delivery",
    date: "17/3/2025",
    price: "150",
    customers: ["Youssef Ali", "Mona Hassan"],
  },
  {
    billID: "#12347",
    coupon: "free delivery",
    date: "17/3/2025",
    price: "150",
    customers: ["Youssef Ali", "Mona Hassan"],
  },
  {
    billID: "#12347",
    coupon: "free delivery",
    date: "17/3/2025",
    price: "150",
    customers: ["Youssef Ali", "Mona Hassan"],
  },
  {
    billID: "#12347",
    coupon: "free delivery",
    date: "17/3/2025",
    price: "150",
    customers: ["Youssef Ali", "Mona Hassan"],
  },
];

export default function BillingInfo() {
  const t = useTranslations("BillingInfo");
  const format = useFormatter();
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <Card
      className={`md:col-span-2 col-span-1 grid grid-rows-6 gap-1 px-3 pt-0 h-[70vh] ${isRTL ? "text-right" : "text-left"}`}
    >
      <div className="row-span-1 flex flex-row place-content-between items-center">
        <div className="text-3xl ">{t("title")}</div>
        <Button variant="outline">{t("exportButton")}</Button>
      </div>
      <div className="row-span-5 overflow-auto rounded-2xl">
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
                {t("price")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testData.map((bill, index) => {
              return (
                <TableRow key={index}>
                  <TableCell className="font-medium">{bill.billID}</TableCell>
                  <TableCell>{bill.coupon}</TableCell>
                  <TableCell>{bill.date}</TableCell>
                  <TableCell>
                    {bill.customers.map((customer, i) => (
                      <div key={i}>{customer}</div>
                    ))}
                  </TableCell>
                  <TableCell className="text-right">{bill.price}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
