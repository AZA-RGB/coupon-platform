import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardTitle } from "@/components/ui/card";
import { Separator } from "@radix-ui/react-separator";
import { Ticket } from "lucide-react";

interface Coupon {
  id: number;
  name: string;
  price: number;
  category: {
    id: number;
    name: string;
  };
  images: string[];
}

interface CouponsListProps {
  coupons: Coupon[];
  title: string;
  isArabic?: boolean;
}

export default function CouponsList({
  coupons,
  title,
  isArabic = false,
}: CouponsListProps) {
  return (
    <Card className="grid  gap-1 px-3  max-h-[70vh]">
      <CardTitle className="flex gap-3 text-2xl text-primary  items-center">
        <Ticket />
        {title}
      </CardTitle>

      <div className="row-span-5 overflow-auto">
        <ScrollArea className="rounded-md">
          <div className="">
            {coupons.map((coupon) => (
              <div key={coupon.id}>
                <div
                  className={`flex items-center p-3 hover:bg-muted space-x-4 ${isArabic ? "flex-row-reverse text-right space-x-reverse" : ""}`}
                >
                  <Avatar>
                    {coupons.images && coupon.images.length > 0 ? (
                      <AvatarImage src={coupon.images[0]} />
                    ) : (
                      <AvatarFallback>
                        <Ticket className="h-5 w-5" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div
                    className={`flex flex-col ${isArabic ? "items-end" : ""}`}
                  >
                    <div className="font-medium">{coupon.name}</div>
                    {coupon.category && (
                      <div className="text-muted-foreground">
                        {coupon.category.name} - ${coupon.price}
                      </div>
                    )}
                  </div>
                </div>
                <Separator />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}
