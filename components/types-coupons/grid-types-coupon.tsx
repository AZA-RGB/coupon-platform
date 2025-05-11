import Link from "next/link";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import Image from "next/image";
import { format } from "date-fns/format";

export function CouponGrid({
  coupons,
  t,
}: {
  coupons: typeof couponTypesData;
  t: any;
}) {
  return (
    <Card>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {coupons.map((coupon) => (
            <CouponCard key={coupon.id} coupon={coupon} t={t} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function CouponCard({
  coupon,
  t,
}: {
  coupon: (typeof couponTypesData)[0];
  t: any;
}) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow p-0">
      <div className="relative w-full h-32">
        <Image
          src={coupon.image}
          alt={coupon.name}
          fill
          className="object-cover"
        />
        <div className="absolute bottom-1 left-1 bg-background/90 px-2 py-0.5 rounded text-xs">
          <span className="text-primary font-bold">
            {coupon.couponsCount} {t("coupons")}
          </span>
        </div>
      </div>
      <CardHeader className="py-0 px-3">
        <CardTitle className="text-lg">{coupon.name}</CardTitle>
        <CardDescription className="flex justify-between items-center text-xs">
          <span className="line-clamp-1 text-ellipsis overflow-hidden">
            {coupon.description}
          </span>
          <StatusBadge status={coupon.status} t={t} />
        </CardDescription>
      </CardHeader>
      <CardContent className="py-1 px-3">
        <div className="flex justify-between text-xs">
          <span>
            {t("added")}: {format(new Date(coupon.addDate), "MMM dd, yyyy")}
          </span>
        </div>
      </CardContent>
      <CardFooter className="px-3 pb-3 flex justify-center gap-2">
        <CouponActionButton
          variant="outline"
          href={`/dashboard/coupons/types/${coupon.id}`}
          label={t("details")}
        />
        <CouponActionButton
          variant="default"
          href={`/dashboard/coupons/new?type=${coupon.id}`}
          label={t("addCoupon")}
        />
      </CardFooter>
    </Card>
  );
}

export function StatusBadge({ status, t }: { status: string; t: any }) {
  const statusClasses = {
    active: "bg-green-100 text-green-800",
    expired: "bg-red-100 text-red-800",
    pending: "bg-yellow-100 text-yellow-800",
  };

  return (
    <span
      className={`px-2 py-0.5 rounded-full ${
        statusClasses[status as keyof typeof statusClasses]
      }`}
    >
      {t(status)}
    </span>
  );
}

export function CouponActionButton({
  variant,
  href,
  label,
}: {
  variant: "default" | "outline";
  href: string;
  label: string;
}) {
  return (
    <Button variant={variant} className="w-1/2 h-8 text-xs" asChild>
      <Link href={href}>{label}</Link>
    </Button>
  );
}