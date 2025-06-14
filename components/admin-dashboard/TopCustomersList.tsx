import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardTitle } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-separator";
import { useTranslations } from "next-intl";

interface Customer {
  id: string;
  name: string;
  avatarUrl: string;
  orderCount: number;
}

const testData: Customer[] = [
  {
    id: "1",
    name: "Ali Assad",
    avatarUrl: "https://github.com/shadcn.png",
    orderCount: 15,
  },
  {
    id: "2",
    name: "Sara Ahmed",
    avatarUrl: "https://avatars.githubusercontent.com/u/88889305?v=4",
    orderCount: 12,
  },
  {
    id: "3",
    name: "Omar Khalid",
    avatarUrl: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Omar",
    orderCount: 10,
  },
  {
    id: "4",
    name: "Lina Mahmoud",
    avatarUrl: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Lina",
    orderCount: 8,
  },
  {
    id: "5",
    name: "Youssef Ali",
    avatarUrl: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Youssef",
    orderCount: 5,
  },
  {
    id: "6",
    name: "Ahmed Hassan",
    avatarUrl: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Ahmed",
    orderCount: 3,
  },
  {
    id: "7",
    name: "Fatima Ali",
    avatarUrl: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Fatima",
    orderCount: 2,
  },
  {
    id: "8",
    name: "Kareem Mahmoud",
    avatarUrl: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Kareem",
    orderCount: 1,
  },
  {
    id: "9",
    name: "Nour Ibrahim",
    avatarUrl: "https://api.dicebear.com/7.x/pixel-art/svg?seed=Nour",
    orderCount: 0,
  },
];
// Replace with your actual language detection logic
const isArabic = true;

export default function TopCustomersList() {
  const t = useTranslations();
  return (
    <div className="">
      <Card className="grid grid-rows-6 gap-1 px-3 pt-0 h-[70vh]">
        <div className="row-span-1 flex flex-row place-content-between items-center">
          <CardTitle className="text-3xl  text-primary">
            {t("Topcustomers")}
          </CardTitle>
        </div>
        <div className="row-span-5 overflow-auto">
          <ScrollArea className="rounded-md ">
            <div className="">
              {testData.map((customer) => (
                <div key={customer.id}>
                  <div
                    className={`flex  items-center p-3 hover:bg-muted space-x-4 ${isArabic ? "flex-row-reverse text-right  place-conte-end space-x-reverse" : "place-content-start"}`}
                  >
                    <Avatar>
                      <AvatarImage src={customer.avatarUrl} />
                      <AvatarFallback>
                        {customer.name.slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <div>{customer.name}</div>
                      <div className="text-muted-foreground">
                        Orders: {customer.orderCount}
                      </div>
                    </div>
                  </div>
                  <Separator className="" />
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </Card>
    </div>
  );
}
