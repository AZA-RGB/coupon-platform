import { useTranslations } from "next-intl";
import { Card, CardTitle } from "../ui/card";
import { BoxesIcon, TicketPercentIcon } from "lucide-react";

interface PurchaseTypeBreakdownProps {
  data: {
    coupon: {
      count: number;
      amount: number;
    };
    package: {
      count: number;
      amount: number;
    };
  };
}

export default function PurchaseTypeBreakdown({
  data,
}: PurchaseTypeBreakdownProps) {
  const t = useTranslations("SalesReport");

  return (
    <Card className="p-5">
      <CardTitle className="text-2xl text-primary mb-4">
        {t("PurchaseTypeBreakdown.title")}
      </CardTitle>

      <div className="flex gap-3">
        <Card className="flex-1 p-4 text-center">
          <BoxesIcon size={40} className="mx-auto mb-2" />
          <div className="font-semibold">
            {t("PurchaseTypeBreakdown.package")}
          </div>
          <div className="text-lg font-bold">
            ${data.package.amount.toFixed(2)}
          </div>
          <div className="text-sm text-gray-500">
            {t("PurchaseTypeBreakdown.purchases", {
              count: data.package.count,
            })}
          </div>
        </Card>

        <Card className="flex-1 p-4 text-center">
          <TicketPercentIcon size={40} className="mx-auto mb-2" />
          <div className="font-semibold">
            {t("PurchaseTypeBreakdown.coupon")}
          </div>
          <div className="text-lg font-bold">
            ${data.coupon.amount.toFixed(2)}
          </div>
          <div className="text-sm text-gray-500">
            {t("PurchaseTypeBreakdown.purchases", { count: data.coupon.count })}
          </div>
        </Card>
      </div>
    </Card>
  );
}
