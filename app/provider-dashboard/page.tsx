"use client";

import { EventsCarousel } from "@/components/admin-dashboard/EventsCarousel";
import QRCodeComp from "@/components/dashboard/QR-code";
import TopProvidersTable from "@/components/dashboard/top-providers-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  DollarSign,
  LineChart,
  Package,
  ShoppingCart,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import ProviderGeneralCards from "@/components/dashboard/providerGeneralCards";
import Cookies from "js-cookie";

export default function Dashboard() {
  const t = useTranslations();
  const [purchaseKey, setPurchaseKey] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [message]);

  const validatePurchaseKey = (key) => {
    // Check if the input is empty
    if (!key.trim()) {
      return "Purchase key cannot be empty";
    }
    return "";
  };

  const handleRedeem = async () => {
    // Validate the purchase key
    const validationMessage = validatePurchaseKey(purchaseKey);
    if (validationMessage) {
      setValidationError(validationMessage);
      setMessage("");
      return;
    }

    // Clear any previous validation error
    setValidationError("");

    try {
      const response = await fetch(
        "http://164.92.67.78:3002/api/redeems/create-redeem-from-purchase-key",
        {
          method: "POST",
          headers: {
            authorization: `Bearer ${Cookies.get("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ purchase_key: purchaseKey }),
        },
      );

      if (response.ok) {
        setMessage("Redeemed successfully!");
        setIsError(false);
        setPurchaseKey(""); // Clear input on success
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message || "Failed to redeem"}`);
        setIsError(true);
      }
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      setIsError(true);
    }
  };

  const cardData = [
    {
      title: t("AdminDashboard.totalSales"),
      value: "867,878",
      icon: <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" />,
    },
    {
      title: t("AdminDashboard.newUsers"),
      value: "12,345",
      icon: <Users className="h-4 w-4 sm:h-5 sm:w-5" />,
    },
    {
      title: t("AdminDashboard.orders"),
      value: "5,678",
      icon: <Package className="h-4 w-4 sm:h-5 sm:w-5" />,
    },
    {
      title: t("AdminDashboard.revenue"),
      value: "$89,012",
      icon: <DollarSign className="h-4 w-4 sm:h-5 sm:w-5" />,
    },
    {
      title: t("AdminDashboard.visitors"),
      value: "234,567",
      icon: <LineChart className="h-4 w-4 sm:h-5 sm:w-5" />,
    },
  ];

  return (
    <div className="p-2 sm:p-5 space-y-3 sm:space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"></div>
      <ProviderGeneralCards />
      {/* main cards - responsive layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="col-span-1 h-[35vh] rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">صرف الكوبون</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="text"
              value={purchaseKey}
              onChange={(e) => {
                setPurchaseKey(e.target.value);
                setValidationError(""); // Clear validation error on input change
              }}
              placeholder="ادخل رمز الشراء"
              className={`border p-2 mb-4 w-full rounded-lg ${validationError ? "border-red-500" : ""}`}
            />
            {validationError && (
              <p className="text-red-500 text-sm mb-2">{validationError}</p>
            )}
            <button
              onClick={handleRedeem}
              className="bg-primary hover:bg-primary-500 text-white p-2 rounded-lg w-full disabled:bg-gray-400"
              disabled={!purchaseKey.trim()}
            >
              صرف
            </button>

            {message && (
              <Alert
                className="mt-4"
                variant={isError ? "destructive" : "default"}
              >
                <AlertTitle>{isError ? "Error" : "Success"}</AlertTitle>
                <AlertDescription>
                  {isError ? "الرجاء ادخال رمز شراء صالح" : "تم الصرف بنجاح"}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
        <div className="h-[35vh]">
          <EventsCarousel />
        </div>
        <Card className="flex-1 flex items-center justify-center p-4">
          <QRCodeComp />
        </Card>
      </div>

      {/* tables - responsive layout */}
      <TopProvidersTable />
    </div>
  );
}
