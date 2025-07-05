import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
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
export default function TopProvidersTable() {
  const t = useTranslations();
  return (
    <Card className="col-span-2 grid grid-rows-6 gap-1 px-3 pt-0 h-[70vh]">
      <div className="row-span-1 flex flex-row place-content-between items-center">
        <div className="text-3xl text-primary font-bold">
          {t("Providers.topProviders")}
        </div>
        <Button variant="outline" className=" dark:">
          {t("Providers.export")}
        </Button>
      </div>
      <div className="row-span-5 overflow-auto">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="w-[100px]">
                {t("CouponsTable.billID")}
              </TableHead>
              <TableHead>{t("CouponsTable.coupon")}</TableHead>
              <TableHead>{t("CouponsTable.date")}</TableHead>
              <TableHead>{t("CouponsTable.customers")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testData.map((bill, index) => (
              <TableRow key={index} className="hover:bg-muted">
                <TableCell className="font-medium ">{bill.billID}</TableCell>
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
