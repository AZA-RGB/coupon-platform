import { useLocale, useTranslations } from "next-intl";
import { Card } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

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

export default function CouponsTable() {
  const locale = useLocale(); // Get the current locale
  const t = useTranslations();
  const isArabic = locale === "ar";

  return (
    <Card className="col-span-2 grid grid-rows-6 gap-1 px-3 pt-0 h-[70vh]">
      <div className="row-span-1 flex flex-row place-content-between items-center">
        <div>
          <div className="text-3xl ">{t("CouponsTable.topCoupons")}</div>
        </div>
      </div>
      <div className="row-span-5 overflow-auto rounded-2xl ">
        <Table>
          <TableHeader className="bg-muted  ">
            <TableRow className="">
              <TableHead
                className={`text-muted-foreground  ${isArabic ? "text-right" : ""}`}
              >
                {t("CouponsTable.billID")}
              </TableHead>
              <TableHead
                className={`text-muted-foreground  ${isArabic ? "text-right" : ""}`}
              >
                {t("CouponsTable.coupon")}
              </TableHead>
              <TableHead
                className={`text-muted-foreground  ${isArabic ? "text-right" : ""}`}
              >
                {t("CouponsTable.date")}
              </TableHead>
              <TableHead
                className={`text-muted-foreground  ${isArabic ? "text-right" : ""}`}
              >
                {t("CouponsTable.customers")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testData.map((bill, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{bill.billID}</TableCell>
                <TableCell>{bill.coupon}</TableCell>
                <TableCell>{bill.date}</TableCell>
                <TableCell>
                  {bill.customers.map((customer, i) => (
                    <div key={i}>{customer}</div>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
