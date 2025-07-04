"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Head from "next/head";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import axios from "axios";

export default function ResetPassword() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const [showPasswords, setShowPasswords] = useState({
    password: false,
    confirmPassword: false,
  });
  const [passwordData, setPasswordData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = (field: "password" | "confirmPassword") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { password: "", confirmPassword: "" };

    if (passwordData.password.length < 8) {
      newErrors.password = t("passwordMinLength");
      valid = false;
    }

    if (passwordData.password !== passwordData.confirmPassword) {
      newErrors.confirmPassword = t("passwordsMismatch");
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    const resetCode = localStorage.getItem("resetCode");

    if (!resetCode) {
      toast.error(t("resetError"), {
        description: t("missingCode"),
        duration: 5000,
      });
      setIsLoading(false);
      return;
    }

    try {
      console.log("Sending reset password data:", { code: resetCode, password: passwordData.password });
      const response = await axios.post(
        "/api/auth/reset-password",
        {
          code: resetCode,
          password: passwordData.password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("API Response:", response.data);
      localStorage.removeItem("resetCode"); // Clean up
      toast.success(t("resetSuccess"), {
        description: t("resetSuccessDesc"),
        duration: 3000,
      });
      router.push("/auth");
    } catch (error: any) {
      console.error("Reset password error:", error.response?.data || error.message);
      let message = t("unknownError");
      if (error.code === "ERR_NETWORK") {
        message = t("networkError");
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      toast.error(t("resetError"), {
        description: `${t("resetErrorDesc")}: ${message}`,
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const commonInputClasses =
    "bg-white dark:bg-gray-800 rounded-[8px] border border-gray-300 dark:border-gray-600 focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-primary-dark focus-visible:border-primary dark:focus-visible:border-primary-dark transition-all duration-300 hover:shadow-sm text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 pr-10";

  return (
    <>
      <Head>
        <title>{t("resetPasswordTitle")}</title>
        <meta name="description" content={t("resetPasswordDescription")} />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-muted/20 to-background dark:from-primary-dark/10 dark:via-muted-dark/20 dark:to-gray-900 flex items-center justify-center p-4 sm:p-6">
        <Card className="w-full max-w-full sm:max-w-md p-6 sm:p-8 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-xl rounded-2xl">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-primary dark:text-primary-dark">{t("resetPassword")}</h1>
          <p className="text-muted-foreground dark:text-muted-dark mb-6 sm:mb-8 text-center text-sm sm:text-base">
            {t("resetPasswordDescription")}
          </p>


          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4 relative">
              <Label htmlFor="password" className="font-medium text-gray-700 dark:text-gray-200">
                {t("newPassword")}
              </Label>
              <div className="relative">
                <Input
                  type={showPasswords.password ? "text" : "password"}
                  id="password"
                  name="password"
                  value={passwordData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={commonInputClasses}
                  required
                  aria-required="true"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground dark:text-muted-dark hover:text-primary dark:hover:text-primary-dark"
                  onClick={() => togglePasswordVisibility("password")}
                  aria-label={showPasswords.password ? t("hidePassword") : t("showPassword")}
                >
                  {showPasswords.password ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive dark:text-destructive-dark">{errors.password}</p>
              )}
            </div>

            <div className="space-y-4 relative">
              <Label htmlFor="confirmPassword" className="font-medium text-gray-700 dark:text-gray-200">
                {t("confirmPassword")}
              </Label>
              <div className="relative">
                <Input
                  type={showPasswords.confirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={commonInputClasses}
                  required
                  aria-required="true"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground dark:text-muted-dark hover:text-primary dark:hover:text-primary-dark"
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                  aria-label={showPasswords.confirmPassword ? t("hidePassword") : t("showPassword")}
                >
                  {showPasswords.confirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive dark:text-destructive-dark">{errors.confirmPassword}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full rounded-[8px] bg-primary dark:bg-primary-dark hover:bg-primary/90 dark:hover:bg-primary-dark/90 text-white font-semibold py-3 sm:py-4 transition-all duration-300 hover:shadow-md disabled:opacity-50"
              disabled={isLoading}
              aria-label={t("resetPassword")}
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
                t("resetPassword")
              )}
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}