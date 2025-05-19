import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChartNoAxesColumnIncreasing } from "lucide-react";
import Image from "next/image";

const testData = [
  {
    billID: "#12345",
    coupon: "shawarma coupon",
    date: "15/3/2025",
    customers: ["Ali Assad", "Sara Ahmed", "Omar Khalid"],
  },
  {
    billID: "#12346",
    coupon: "10% discount",
    date: "16/3/2025",
    customers: ["Lina Mahmoud"],
  },
  {
    billID: "#12347",
    coupon: "free delivery",
    date: "17/3/2025",
    customers: ["Youssef Ali", "Mona Hassan"],
  },
  {
    billID: "#12347",
    coupon: "free delivery",
    date: "17/3/2025",
    customers: ["Youssef Ali", "Mona Hassan"],
  },
  {
    billID: "#12347",
    coupon: "free delivery",
    date: "17/3/2025",
    customers: ["Youssef Ali", "Mona Hassan"],
  },
  {
    billID: "#12347",
    coupon: "free delivery",
    date: "17/3/2025",
    customers: ["Youssef Ali", "Mona Hassan"],
  },
  {
    billID: "#12347",
    coupon: "free delivery",
    date: "17/3/2025",
    customers: ["Youssef Ali", "Mona Hassan"],
  },
  {
    billID: "#12347",
    coupon: "free delivery",
    date: "17/3/2025",
    customers: ["Youssef Ali", "Mona Hassan"],
  },
  {
    billID: "#12347",
    coupon: "free delivery",
    date: "17/3/2025",
    customers: ["Youssef Ali", "Mona Hassan"],
  },
  {
    billID: "#12347",
    coupon: "free delivery",
    date: "17/3/2025",
    customers: ["Youssef Ali", "Mona Hassan"],
  },
  {
    billID: "#12347",
    coupon: "free delivery",
    date: "17/3/2025",
    customers: ["Youssef Ali", "Mona Hassan"],
  },
  {
    billID: "#12347",
    coupon: "free delivery",
    date: "17/3/2025",
    customers: ["Youssef Ali", "Mona Hassan"],
  },
  {
    billID: "#12347",
    coupon: "free delivery",
    date: "17/3/2025",
    customers: ["Youssef Ali", "Mona Hassan"],
  },
];

const ReportPage = () => {
  return (
    <div className="px-6 mb-6">
      <div className="min-h-[60vh] grid grid-cols-1 md:grid-rows-2 gap-4">
        <div className="bg-primary relative rounded-2xl ">
          <Image
            src="/whiteWavyNet.svg"
            alt=""
            className=" h-full object-cover "
            fill
          />
          <div className="relative h-full w-1/2 top-1/12 left-7 right-8 flex flex-row">
            <div className="bg-amber-100 rounded-2xl h-5/6 w-60 "></div>
            <h1 className="font-extrabold text-4xl ml-6 relative pr-5 top-2/3">
              Name
            </h1>
          </div>
        </div>
        <Card className=" p-6 ">
          <div className="min-h-full  grid grid-rows-4 ">
            <div className=" row-span-1 flex flex-row place-content-between">
              <div className="text-primary text-2xl">sales Report</div>
              <Button
                variant="outline"
                className=" border-primary dark:border-primary"
              >
                Export
              </Button>
            </div>
            <div className="  row-span-3  ">
              <div className="h-full w-full grid grid-cols-5 gap-10 ">
                <div className="bg-[#FFE2E5] text-amber-950 rounded-2xl flex flex-col place-content-between p-4 pl-6">
                  <span className="">
                    
                    <ChartNoAxesColumnIncreasing size={40} />
                  </span>
                  <div className="font-extrabold text-3xl"> $1K</div>
                  <div> Total sales</div>
                </div>
                <div className="bg-[#FFF4DE] rounded-2xl"></div>
                <div className="bg-[#DCFCE7] rounded-2xl"></div>
                <div className="bg-[#F3E8FF] rounded-2xl"></div>
                <div className="bg-[#F3E8FF] rounded-2xl"></div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-4  mt-4 ">
<Card className="col-span-2 grid grid-rows-6 gap-1 px-3 pt-0 h-[70vh]">
  <div className="row-span-1 flex flex-row place-content-between items-center">
    <div className="text-3xl text-primary">Billing information</div>
    <Button variant="outline" className="border-primary dark:border-primary">
      Export
    </Button>
  </div>
  <div className="row-span-5 overflow-auto">
    <Table>
      <TableHeader className="bg-muted">
        <TableRow>
          <TableHead className="w-[100px]">Bill ID</TableHead>
          <TableHead>Coupon</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Customers</TableHead>
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
        <Card className="col-span-1 "></Card>
      </div>
    </div>
  );
};

export default ReportPage;
