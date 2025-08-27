import { useTranslations } from "next-intl";
import { Card, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { UsersRound } from "lucide-react";

interface ProviderData {
  provider_id: number;
  provider_name: string;
  amount: number;
}

interface TopThreeProps {
  top_providers_by_revenue: ProviderData[];
}

export default function TopProvidersByRevenue({
  top_providers_by_revenue,
}: TopThreeProps) {
  const t = useTranslations("Invoices");

  return (
    <Card className="col-span-1  px-3 max-h-[90vh]">
      <CardTitle className="flex gap-3 text-2xl text-primary items-center">
        <UsersRound />
        <div>Top providers by revenue</div>
      </CardTitle>

      <div className="row-span-5 overflow-auto">
        <ScrollArea className="rounded-md">
          <div className="">
            {top_providers_by_revenue.map((provider) => (
              <div key={provider.provider_id}>
                <div className="flex place-content-between p-3 hover:bg-muted">
                  <div className="flex flex-col">{provider.provider_name}</div>
                  <div className="flex space-x-2 align-middle items-center">
                    <div>${provider.amount}</div>
                  </div>
                </div>
                <Separator className="" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}
