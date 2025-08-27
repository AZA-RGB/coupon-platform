"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { fetchCouponDetails } from "../constants";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Star, MapPin, Phone, Mail, Tag, ChevronLeft } from "lucide-react";

const CouponDetailsPage = () => {
  const t = useTranslations("Coupons");
  const { id } = useParams();
  const [coupon, setCoupon] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCouponDetails = async () => {
      setIsLoading(true);
      try {
        const couponData = await fetchCouponDetails(id);
        setCoupon(couponData);
      } catch (err) {
        setError(t("fetchError"));
        console.error("Failed to fetch coupon details:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadCouponDetails();
  }, [id, t]);

  if (isLoading) {
    return (
      <div className="container mx-auto pt-5 pb-6 px-4 flex justify-center items-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <Spinner className="animate-spin h-12 w-12" />
          <p className="text-muted-foreground">{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (error || !coupon) {
    return (
      <div className="container mx-auto pt-5 pb-6 px-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-destructive">{t("error")}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <p className="text-red-600 mb-4 text-center">{error || t("noCouponFound")}</p>
            <Button asChild>
              <Link href="/coupons">
                <ChevronLeft className="mr-2 h-4 w-4" />
                {t("backToCoupons")}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Determine badge color based on status
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case "expired":
        return "bg-red-100 text-red-800 hover:bg-red-100";
      case "upcoming":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  return (
    <div className="container mx-auto pt-5 pb-6 px-4 max-w-4xl">
      {/* <Button variant="ghost" asChild className="mb-4">
        <Link href="/dashboard/coupons">
          <ChevronLeft className="mr-2 h-4 w-4" />
          {t("backToCoupons")}
        </Link>
      </Button> */}

      <Card className="overflow-hidden shadow-lg">
        <CardHeader className="pb-4 bg-muted/20">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-3xl font-bold">{coupon.name}</CardTitle>
              <CardDescription className="text-lg mt-2">{coupon.description}</CardDescription>
            </div>
            <Badge className={`text-lg py-1 px-3 ${getStatusColor(coupon.coupon_status)}`}>
              {t(coupon.coupon_status)}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Coupon Image */}
          <div className="relative w-full h-72 md:h-96">
            <Image
              src={coupon.files[0]?.path || "https://cdn.pixabay.com/photo/2022/04/22/01/04/ticket-7148607_1280.png"}
              alt={coupon.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm rounded-full p-2">
              <div className="flex items-center text-lg font-semibold">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mr-1" />
                {coupon.average_rating || "N/A"}
              </div>
            </div>
          </div>

          {/* Coupon Code Highlight */}
          <div className="p-6 bg-primary/5 border-b">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="text-lg font-semibold flex items-center">
                  <Tag className="mr-2 h-5 w-5" />
                  {t("yourCouponCode")}
                </h3>
                <p className="text-sm text-muted-foreground">{t("useAtCheckout")}</p>
              </div>
              <div className="bg-background border-2 border-dashed border-primary p-3 rounded-lg">
                <p className="text-2xl font-mono font-bold text-primary">{coupon.coupon_code}</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Coupon Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <Tag className="mr-2 h-5 w-5" />
                  {t("offerDetails")}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("discount")}:</span>
                    <span className="font-semibold">{coupon.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("type")}:</span>
                    <span className="font-semibold">{coupon.coupon_type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("category")}:</span>
                    <span className="font-semibold">{coupon.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("addedDate")}:</span>
                    <span className="font-semibold flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      {coupon.date ? new Date(coupon.date).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Criteria Section */}
              {coupon.couponCriteria.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">{t("criteria")}</h3>
                  <ul className="space-y-2">
                    {coupon.couponCriteria.map((criteria) => (
                      <li key={criteria.id} className="flex justify-between">
                        <span className="text-muted-foreground">{criteria.criteria_name}:</span>
                        <span className="font-semibold">{criteria.value} ({criteria.criteria_type})</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right Column - Provider Info */}
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <MapPin className="mr-2 h-5 w-5" />
                  {t("providerInfo")}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("provider")}:</span>
                    <span className="font-semibold text-right">{coupon.provider}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t("providerLocation")}:</span>
                    <span className="font-semibold text-right">{coupon.provider_location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center">
                      <Mail className="mr-1 h-4 w-4" />
                      {t("providerEmail")}:
                    </span>
                    <a href={`mailto:${coupon.provider_email}`} className="font-semibold text-primary hover:underline">
                      {coupon.provider_email}
                    </a>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center">
                      <Phone className="mr-1 h-4 w-4" />
                      {t("providerPhone")}:
                    </span>
                    <a href={`tel:${coupon.provider_phone}`} className="font-semibold text-primary hover:underline">
                      {coupon.provider_phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Gift Programs */}
              {coupon.giftPrograms.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">{t("giftPrograms")}</h3>
                  <div className="space-y-4">
                    {coupon.giftPrograms.map((gift) => (
                      <div key={gift.id} className="bg-muted/30 p-3 rounded-lg">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t("programType")}:</span>
                          <span className="font-semibold">{gift.program_type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t("pointsValue")}:</span>
                          <span className="font-semibold">{gift.points_value}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{t("isActive")}:</span>
                          <Badge variant={gift.is_active ? "default" : "secondary"}>
                            {gift.is_active ? t("yes") : t("no")}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>

      </Card>
    </div>
  );
};

export default CouponDetailsPage;