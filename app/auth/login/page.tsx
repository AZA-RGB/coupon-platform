// pages/auth/login.tsx
"use client";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import axios from "axios";

interface LoginData {
  email: string;
  password: string;
}

export default function LoginPage() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const [loginData, setLoginData] = useState<LoginData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      console.log("Sending login data:", loginData);
      const response = await axios.post(
        "/api/auth/login",
        {
          email: loginData.email,
          password: loginData.password,
        },
        {
          headers: { "Content-Type": "application/json" },
        },
      );

      console.log("API Response:", response.data);

      // // Extract tokens and role from response
      const role = response.data.role || null;
      const { access_token, refresh_token } = response.data.data || {};

      if (!access_token || !refresh_token || !role) {
        throw new Error(t("tokenError"));
      }

      console.log("Tokens:", access_token, refresh_token);
      console.log("Role:", role);

      // // Save tokens and role to localStorage
      Cookies.set("token", access_token, { expires: 7 }); // expires in 7 days
      Cookies.set("refreshToken", refresh_token, { expires: 30 }); // expires in 30 days
      Cookies.set("userRole", role, { expires: 7 }); // expires in 7 days

      toast.success(t("loginSuccess"), {
        description: t("loginSuccessDesc"),
        duration: 3000,
      });

      // Redirect based on role
      if (role === "admin") {
        router.push("/admin-dashboard");
      } else if (role === "provider") {
        router.push("/provider-dashboard");
      } else {
        router.push("/auth/login"); // User or Guest
      }
    } catch (error: any) {
      console.error("Login error:", error.response?.data || error.message);
      let message = t("unknownError");
      if (error.code === "ERR_NETWORK") {
        message = t("networkError");
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      toast.error(t("loginError"), {
        description: `${t("loginErrorDesc")}: ${message}`,
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const commonInputClasses =
    "bg-white dark:bg-gray-800 rounded-[8px] border border-gray-300 dark:border-gray-600 focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-primary-dark focus-visible:border-primary dark:focus-visible:border-primary-dark transition-all duration-300 hover:shadow-sm text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500";

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-muted/20 to-background dark:from-primary-dark/10 dark:via-muted-dark/20 dark:to-gray-900 flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-full sm:max-w-md p-6 sm:p-8 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-xl rounded-2xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-primary dark:text-primary-dark">
          {t("login")}
        </h1>
        <p className="text-muted-foreground dark:text-muted-dark mb-6 sm:mb-8 text-center text-sm sm:text-base">
          {t("loginDescription")}
        </p>

        <form onSubmit={handleLoginSubmit} className="space-y-5">
          <div className="space-y-4">
            <Label
              htmlFor="email"
              className="font-medium text-gray-700 dark:text-gray-200"
            >
              {t("email")}
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              value={loginData.email}
              onChange={handleLoginChange}
              placeholder={t("emailPlaceholder")}
              required
              className={commonInputClasses}
              aria-required="true"
            />
          </div>

          <div className="space-y-4 relative">
            <Label
              htmlFor="password"
              className="font-medium text-gray-700 dark:text-gray-200"
            >
              {t("password")}
            </Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                className={`${commonInputClasses} pr-10`}
                value={loginData.password}
                onChange={handleLoginChange}
                placeholder="••••••••"
                required
                minLength={8}
                aria-required="true"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground dark:text-muted-dark hover:text-primary dark:hover:text-primary-dark transition-colors"
                onClick={togglePasswordVisibility}
                aria-label={t(showPassword ? "hidePassword" : "showPassword")}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <a
              href="/auth/forget-password"
              className="text-sm text-primary dark:text-primary-dark hover:underline transition-colors"
            >
              {t("forgotPassword")}
            </a>
          </div>

          <div className="text-center">
            <a
              href="/auth/register"
              className="text-sm text-primary dark:text-primary-dark hover:underline transition-colors"
            >
              {t("registerLink")}
            </a>
          </div>

          <Button
            type="submit"
            className="w-full rounded-[8px] bg-primary dark:bg-primary-dark hover:bg-primary/90 dark:hover:bg-primary-dark/90 text-white font-semibold py-3 sm:py-4 transition-all duration-300 hover:shadow-md disabled:opacity-50"
            disabled={isLoading}
            aria-label={t("login")}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                {t("loading")}
              </div>
            ) : (
              t("login")
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}
