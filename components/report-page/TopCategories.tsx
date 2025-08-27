import { useTranslations } from "next-intl";
import { Card, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Shapes } from "lucide-react";

interface CategoryData {
  category_id: number;
  category_name: string;
  amount: number;
}

interface TopCategoriesProps {
  top_categories_by_spend: CategoryData[];
}

export default function TopCategories({
  top_categories_by_spend,
}: TopCategoriesProps) {
  const t = useTranslations("Invoices");

  return (
    <Card className="col-span-1 px-3 max-h-[90vh]">
      <CardTitle className="text-2xl text-primary flex gap-4 items-center">
        <Shapes />
        Top categories by spend
      </CardTitle>

      <div className="row-span-5 overflow-auto">
        <ScrollArea className="rounded-md">
          <div className="">
            {top_categories_by_spend.map((category) => (
              <div key={category.category_id}>
                <div className="flex place-content-between p-3 hover:bg-muted">
                  <div className="flex flex-col">{category.category_name}</div>
                  <div className="flex space-x-2 align-middle items-center">
                    <div>${category.amount.toFixed(2)}</div>
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
