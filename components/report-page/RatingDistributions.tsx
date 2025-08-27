import { Card, CardTitle } from "../ui/card";
import { Separator } from "@radix-ui/react-separator";
import { useTranslations } from "next-intl";

interface RatingDistributionProps {
  ratings: {
    average_rating: number;
    ratings_count: number;
    distribution: {
      rate: number;
      count: number;
    }[];
  };
}

export default function RatingDistribution({
  ratings,
}: RatingDistributionProps) {
  const t = useTranslations("SalesReport.Rating_distribution");

  // Sort distribution by rate (highest first)
  const sortedData = [...ratings.distribution].sort((a, b) => b.rate - a.rate);
  const totalCount = ratings.ratings_count;

  return (
    <Card className="col-span-1 gap-0 px-3 h-auto">
      <CardTitle className="text-2xl text-primary py-4">
        {t("ratingDistribution")}
      </CardTitle>

      {/* Summary stats */}
      <div className="flex justify-between px-3 py-2 text-sm">
        <div>
          {t("totalRatings")}:{" "}
          <span className="font-semibold">{totalCount}</span>
        </div>
        <div>
          {t("averageRating")}:{" "}
          <span className="font-semibold">
            {ratings.average_rating.toFixed(1)}
          </span>
        </div>
      </div>

      <div className="overflow-auto">
        <div className="min-w-full">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-2 px-3 py-2 font-semibold text-sm text-muted-foreground">
            <div className="col-span-3">{t("rate")}</div>
            <div className="col-span-3">{t("count")}</div>
            <div className="col-span-3 text-right">{t("percentage")}</div>
          </div>

          <Separator className="my-1" />

          {/* Table Rows */}
          {sortedData.map((item, index) => {
            const percentage =
              totalCount > 0 ? ((item.count / totalCount) * 100).toFixed(1) : 0;

            return (
              <div key={index}>
                <div className="grid grid-cols-12 gap-2 px-3 py-3 items-center hover:bg-muted/50">
                  {/* Stars */}
                  <div className="col-span-3 flex">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className={
                          i < item.rate ? "text-yellow-500" : "text-gray-300"
                        }
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  {/* Count and Progress bar */}
                  <div className="col-span-6 flex items-center gap-2">
                    <div className="w-20 text-sm font-medium">{item.count}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                      <div
                        className="bg-primary h-2.5 rounded-full"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Percentage */}
                  <div className="col-span-1 text-right text-sm">
                    {percentage}%
                  </div>
                </div>
                {index < sortedData.length - 1 && <Separator />}
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
