import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardTitle } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-separator";
import { useTranslations } from "next-intl";
import useSWR from "swr";

// Define types based on the provided data structure
interface User {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  role: string;
  status: string;
}

interface Customer {
  id: number;
  user_id: number;
  bank_id: string | null;
  birth_date: string;
  location: string;
  purchases_count: number;
  user: User & {
    user_id: number;
    bank_id: string | null;
    birth_date: string;
    location: string;
    purchases_count: number;
    user: User;
  };
}

interface TopCustomersResponse {
  message: string;
  data: {
    top_customers: Customer[];
    top_coupons: any[]; // We won't use this in this component
  };
}

export default function TopCustomersList() {
  const t = useTranslations();
  const { data, error, isLoading } = useSWR<TopCustomersResponse>(
    "/coupons/top-coupons-customers",
  );

  const isArabic = true;

  if (error) {
    return (
      <div className="">
        <Card className="grid grid-rows-6 gap-1 px-3 pt-0 h-[70vh]">
          <div className="row-span-1 flex flex-row place-content-between items-center">
            <CardTitle className="text-2xl font-normal text-primary"></CardTitle>
          </div>
          <div className="row-span-5 flex items-center justify-center">
            <p className="text-muted-foreground">Failed to load customers</p>
          </div>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="">
        <Card className="grid grid-rows-6 gap-1 px-3 pt-0 h-[70vh]">
          <div className="row-span-1 flex flex-row place-content-between items-center">
            <CardTitle className="text-2xl font-normal">
              {t("Topcustomers")}
            </CardTitle>
          </div>
          <div className="row-span-5 flex items-center justify-center">
            <p className="text-muted-foreground">Loading customers...</p>
          </div>
        </Card>
      </div>
    );
  }

  const customers = data?.data?.top_customers || [];

  // Function to generate avatar URL based on customer name
  const getAvatarUrl = (name: string, id: number) => {
    // You can use any avatar service you prefer
    return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${name.replace(/\s+/g, "")}`;
  };

  return (
    <div className="">
      <Card className="grid grid-rows-6 gap-1 px-3 pt-0 h-[70vh]">
        <div className="row-span-1 flex flex-row place-content-between items-center">
          <CardTitle className="text-2xl font-normal  text-primary">
            {t("Topcustomers")}
          </CardTitle>
        </div>
        <div className="row-span-5 overflow-auto">
          <ScrollArea className="rounded-md">
            <div className="">
              {customers.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No customers found</p>
                </div>
              ) : (
                customers.map((customer) => (
                  <div key={customer.id}>
                    <div
                      className={`flex items-center p-3 hover:bg-muted space-x-4 ${
                        isArabic
                          ? "flex-row-reverse text-right place-content-end space-x-reverse"
                          : "place-content-start"
                      }`}
                    >
                      <Avatar>
                        <AvatarImage
                          src={getAvatarUrl(customer.user.name, customer.id)}
                        />
                        <AvatarFallback>
                          {customer.user.name.slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`flex flex-col ${
                          isArabic ? "items-end" : "items-start"
                        }`}
                      >
                        <div>{customer.user.name}</div>
                        <div className="text-muted-foreground">
                          {t("Purchases")}: {customer.purchases_count}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {customer.location}
                        </div>
                      </div>
                    </div>
                    <Separator />
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>
      </Card>
    </div>
  );
}
