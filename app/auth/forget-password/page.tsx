"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Head from "next/head";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import axios from "axios";

export default function ForgotPassword() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const [loginData, setLoginData] = useState({
    phone: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Sending forgot password data:", loginData); // Debug request data
      const response = await axios.post(
        "/api/auth/forget-password",
        {
          phone: loginData.phone,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("API Response:", response.data); // Debug API response

      toast.success(t("sendSuccess"), {
        description: t("sendSuccessDesc"),
        duration: 3000,
      });
      router.push("/auth/verify-code-password");
    } catch (error: any) {
      console.error("Forgot password error:", error.response?.data || error.message);
      let message = t("unknownError");
      if (error.code === "ERR_NETWORK") {
        message = t("networkError");
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      toast.error(t("sendError"), {
        description: `${t("sendErrorDesc")}: ${message}`,
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const commonInputClasses =
    "bg-white dark:bg-gray-800 rounded-[8px] border border-gray-300 dark:border-gray-600 focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-primary-dark focus-visible:border-primary dark:focus-visible:border-primary-dark transition-all duration-300 hover:shadow-sm text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500";

  return (
    <>
      <Head>
        <title>{t("forgotPasswordTitle")}</title>
        <meta name="description" content={t("forgotPasswordDescription")} />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-muted/20 to-background dark:from-primary-dark/10 dark:via-muted-dark/20 dark:to-gray-900 flex items-center justify-center p-4 sm:p-6">
        <Card className="w-full max-w-full sm:max-w-md p-6 sm:p-8 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-xl rounded-2xl">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-primary dark:text-primary-dark">{t("forgotPassword")}</h1>
          <p className="text-muted-foreground dark:text-muted-dark mb-6 sm:mb-8 text-center text-sm sm:text-base">
            {t("forgotPasswordDescription")}
          </p>


          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div className="space-y-4">
              <Label htmlFor="phone" className="font-medium text-gray-700 dark:text-gray-200">
                {t("phone")}
              </Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={loginData.phone}
                onChange={handleLoginChange}
                placeholder={t("phonePlaceholder")}
                title={t("phoneTitle")}
                pattern="^\+9639\d{8}$"
                required
                className={commonInputClasses}
                aria-required="true"
              />
            </div>
            <Button
              type="submit"
              className="w-full rounded-[40px] bg-primary dark:bg-primary-dark hover:bg-primary/90 dark:hover:bg-primary-dark/90 text-white font-semibold py-3 sm:py-4 transition-all duration-300 hover:shadow-md disabled:opacity-50"
              disabled={isLoading}
              aria-label={t("send")}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {t("loading")}
                </div>
              ) : (
                t("send")
              )}
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}