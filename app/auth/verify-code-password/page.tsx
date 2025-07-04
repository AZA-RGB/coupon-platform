"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import axios from "axios";

export default function VerifyOTP() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const validateOtp = () => {
    if (otp.length !== 5 || !/^\d{5}$/.test(otp)) {
      toast.error(t("verifyError"), {
        description: t("invalidOtp"),
        duration: 5000,
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateOtp()) return;

    setIsLoading(true);
    try {
      console.log("Sending OTP verification data:", { code: otp });
      const response = await axios.post(
        "/api/auth/verify-code",
        { code: otp },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("API Response:", response.data);
      localStorage.setItem("resetCode", otp); // Store for reset-password
      toast.success(t("verifySuccess"), {
        description: t("verifySuccessDesc"),
        duration: 3000,
      });
      router.push("/auth/reset-password");
    } catch (error: any) {
      console.error("OTP verification error:", error.response?.data || error.message);
      let message = t("unknownError");
      if (error.code === "ERR_NETWORK") {
        message = t("networkError");
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      toast.error(t("verifyError"), {
        description: `${t("verifyErrorDesc")}: ${message}`,
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    const phone = localStorage.getItem("phone");
    if (!phone) {
      toast.error(t("resendError"), {
        description: t("missingPhone"),
        duration: 5000,
      });
      return;
    }

    setIsResending(true);
    try {
      console.log("Resending OTP for phone:", phone);
      const response = await axios.post(
        "/api/auth/forget-password",
        { phone },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Resend API Response:", response.data);
      toast.success(t("resendSuccess"), {
        description: t("resendSuccessDesc"),
        duration: 3000,
      });
    } catch (error: any) {
      console.error("Resend OTP error:", error.response?.data || error.message);
      let message = t("unknownError");
      if (error.code === "ERR_NETWORK") {
        message = t("networkError");
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      toast.error(t("resendError"), {
        description: `${t("resendErrorDesc")}: ${message}`,
        duration: 5000,
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <>
      <Head>
        <title>{t("verifyOtpTitle")}</title>
        <meta name="description" content={t("verifyOtpDescription")} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-muted/20 to-background dark:from-primary-dark/10 dark:via-muted-dark/20 dark:to-gray-900 flex items-center justify-center p-4 sm:p-6">
        <Card className="w-full max-w-full sm:max-w-md p-6 sm:p-8 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-xl rounded-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl sm:text-3xl font-bold text-primary dark:text-primary-dark">
              {t("verifyOtp")}
            </CardTitle>
            <CardDescription className="text-muted-foreground dark:text-muted-dark mt-2 text-sm sm:text-base">
              {t("verifyOtpDescription")}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center mb-6">
                <InputOTP
                  maxLength={5}
                  value={otp}
                  required
                  onChange={(value) => setOtp(value)}
                  aria-label={t("verifyOtp")}
                >
                  <InputOTPGroup className="gap-3">
                    {[...Array(5)].map((_, i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className="h-12 w-12 text-xl bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-[12px] shadow-sm focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark focus:border-primary dark:focus:border-primary-dark ring-offset-0 transition-all duration-150 text-center text-gray-900 dark:text-gray-100"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <div className="w-full flex justify-center">
                <Button
                  type="submit"
                  className="w-full max-w-[20rem] rounded-[8px] bg-primary dark:bg-primary-dark hover:bg-primary/90 dark:hover:bg-primary-dark/90 text-white font-semibold py-3 sm:py-4 transition-all duration-300 hover:shadow-md disabled:opacity-50"
                  disabled={isLoading}
                  aria-label={t("verify")}
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
                    t("verify")
                  )}
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground dark:text-muted-dark">
                {t("didNotReceiveCode")}{" "}
                <Button
                  variant="link"
                  className="p-0 text-primary dark:text-primary-dark h-auto font-medium hover:underline"
                  onClick={handleResend}
                  disabled={isResending}
                  aria-label={t("resendOtp")}
                >
                  {isResending ? (
                    <div className="flex items-center">
                      <svg className="animate-spin h-4 w-4 mr-1 text-primary dark:text-primary-dark" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {t("loading")}
                    </div>
                  ) : (
                    t("resendOtp")
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}