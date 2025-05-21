import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Separator } from "@radix-ui/react-separator";
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
export default function Invoices() {
    
  return (
    <Card className="col-span-1 grid grid-rows-6 gap-1 px-3 pt-0 h-[70vh]">
      <div className="row-span-1 flex flex-row place-content-between items-center">
        <div className="text-3xl text-primary">Invoices</div>
        <Button variant="outline" className=" dark:">
          Export
        </Button>
      </div>
      <div className="row-span-5 overflow-auto">
        <ScrollArea className="  rounded-md ">
          <div className="">
            {testData.map((tag) => (
              <>
                <div
                  key={tag.billID}
                  className="flex place-content-between p-3 hover:bg-muted"
                >
                  <div className="flex flex-col">
                    {tag.date}
                    <div className="text-muted-foreground">{tag.billID}</div>
                  </div>
                  <div className="flex space-x-2">
                    <div> ${tag.price}</div>
                    <div> PDF</div>
                  </div>
                </div>
                <Separator className="" />
              </>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}