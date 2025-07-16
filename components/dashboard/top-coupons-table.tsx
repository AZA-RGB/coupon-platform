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
export default function TopCouponsTable() {
  const t = useTranslations("CouponsTable");

  return (
    <Card className="col-span-2 grid grid-rows-6 gap-1 px-3 pt-0 h-[70vh]">
      <div className="row-span-1 flex flex-row place-content-between items-center">
        <div>
          <div className="text-2xl  ">{t("topCoupons")}</div>
          <div className="text-sm text-muted-foreground">
            {t("top10Coupons")}
          </div>
        </div>

        <Tabs defaultValue="For me">
          <TabsList>
            <TabsTrigger value="For me">{t("forMe")}</TabsTrigger>
            <TabsTrigger value="For all">{t("forAll")}</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="row-span-5 overflow-auto">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="w-[100px]">{t("billID")}</TableHead>
              <TableHead>{t("coupon")}</TableHead>
              <TableHead>{t("date")}</TableHead>
              <TableHead>{t("customers")}</TableHead>
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
