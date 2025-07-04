"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { FiX } from "react-icons/fi";
import { Eye, EyeOff, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import axios from "axios";

interface RegisterData {
  email: string;
  phone: string;
  password: string;
  name: string;
  bankId: string;
  location: string;
  categoryId: string;
  description: string;
  profilePhoto: File | null;
  backgroundPhoto: File | null;
}

interface Category {
  id: number;
  name: string;
}

export default function RegisterPage() {
  const t = useTranslations("Auth");
  const router = useRouter();
  const [registerData, setRegisterData] = useState<RegisterData>({
    email: "",
    phone: "",
    password: "",
    name: "",
    bankId: "",
    location: "",
    categoryId: "",
    description: "",
    profilePhoto: null,
    backgroundPhoto: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fileError, setFileError] = useState({ profilePhoto: false, backgroundPhoto: false });
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const profilePhotoInputRef = useRef<HTMLInputElement>(null);
  const backgroundPhotoInputRef = useRef<HTMLInputElement>(null);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        let allCategories: Category[] = [];
        let page = 1;
        let lastPage = 1;

        do {
          const response = await axios.get(`http://164.92.67.78:3002/api/categories/index?page=${page}`);
          const { data, last_page } = response.data.data;
          allCategories = [...allCategories, ...data];
          lastPage = last_page;
          page++;
        } while (page <= lastPage);

        setCategories(allCategories);
        if (allCategories.length > 0) {
          setRegisterData((prev) => ({ ...prev, categoryId: String(allCategories[0].id) }));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error(t("categoryFetchError"), {
          description: t("categoryFetchErrorDesc"),
          duration: 5000,
        });
      }
    };

    fetchCategories();
  }, [t]);

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (e.target.type === "file" && files?.[0]) {
      setRegisterData((prev) => ({ ...prev, [name]: files[0] }));
      setFileError((prev) => ({ ...prev, [name]: false }));
    } else {
      setRegisterData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileButtonClick = (ref: React.RefObject<HTMLInputElement>) => {
    ref.current?.click();
  };

  const removeFile = (field: "profilePhoto" | "backgroundPhoto") => {
    setRegisterData((prev) => ({ ...prev, [field]: null }));
    if (field === "profilePhoto" && profilePhotoInputRef.current) {
      profilePhotoInputRef.current.value = "";
    } else if (field === "backgroundPhoto" && backgroundPhotoInputRef.current) {
      backgroundPhotoInputRef.current.value = "";
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!registerData.profilePhoto || !registerData.backgroundPhoto) {
      setFileError({
        profilePhoto: !registerData.profilePhoto,
        backgroundPhoto: !registerData.backgroundPhoto,
      });
      setIsLoading(false);
      return;
    }

    if (!registerData.categoryId) {
      toast.error(t("categoryRequired"), {
        description: t("categoryRequiredDesc"),
        duration: 5000,
      });
      setIsLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("email", registerData.email);
    formData.append("password", registerData.password);
    formData.append("phone", registerData.phone);
    formData.append("role", "provider");
    formData.append("deviceFingerprint", "fingerprint123");
    formData.append("name", registerData.name);
    formData.append("providerData[bank_id]", registerData.bankId);
    formData.append("providerData[location]", registerData.location);
    formData.append("providerData[category_id]", registerData.categoryId);
    formData.append("providerData[description]", registerData.description);
    if (registerData.profilePhoto) {
      formData.append("profile_photo", registerData.profilePhoto);
    }
    if (registerData.backgroundPhoto) {
      formData.append("background_photo", registerData.backgroundPhoto);
    }

    try {
      console.log("Sending formData:", Object.fromEntries(formData)); // Debug form data
      const response = await axios.post(
        "/api/auth/register",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("API Response:", response.data); // Debug API response

      // Extract tokens from response.data.data
      const { access_token, refresh_token } = response.data.data || {};

      if (!access_token || !refresh_token) {
        throw new Error(t("tokenError"));
      }

      // Store tokens in localStorage
      localStorage.setItem("token", access_token);
      localStorage.setItem("refreshToken", refresh_token);

      toast.success(t("registerSuccess"), {
        description: t("registerSuccessDesc"),
        duration: 3000,
      });
      router.push("/dashboard");
    } catch (error: any) {
      console.error("Register error:", error.response?.data || error.message);
      let message = t("unknownError");
      if (error.code === "ERR_NETWORK") {
        message = t("networkError");
      } else if (error.response?.data?.message) {
        message = error.response.data.message;
      } else if (error.message) {
        message = error.message;
      }
      toast.error(t("registerError"), {
        description: `${t("registerErrorDesc")}: ${message}`,
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const commonInputClasses = "bg-white dark:bg-gray-800 rounded-[8px] border border-gray-300 dark:border-gray-600 focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-primary-dark focus-visible:border-primary dark:focus-visible:border-primary-dark transition-all duration-300 hover:shadow-sm text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500";

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-muted/20 to-background dark:from-primary-dark/10 dark:via-muted-dark/20 dark:to-gray-900 flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-full sm:max-w-3xl p-6 sm:p-8 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-xl rounded-2xl">
        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-primary dark:text-primary-dark">{t("register")}</h1>
        <p className="text-muted-foreground dark:text-muted-dark mb-6 sm:mb-8 text-center text-sm sm:text-base">
          {t("registerDescription")}
        </p>


        <form onSubmit={handleRegisterSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="space-y-4">
              <Label htmlFor="email" className="font-medium text-gray-700 dark:text-gray-200">{t("email")}</Label>
              <Input
                type="email"
                id="email"
                name="email"
                className={commonInputClasses}
                value={registerData.email}
                onChange={handleRegisterChange}
                placeholder={t("emailPlaceholder")}
                required
                aria-required="true"
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="name" className="font-medium text-gray-700 dark:text-gray-200">{t("name")}</Label>
              <Input
                type="text"
                id="name"
                name="name"
                className={commonInputClasses}
                value={registerData.name}
                onChange={handleRegisterChange}
                placeholder={t("namePlaceholder")}
                required
                aria-required="true"
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="phone" className="font-medium text-gray-700 dark:text-gray-200">{t("phone")}</Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                className={commonInputClasses}
                value={registerData.phone}
                onChange={handleRegisterChange}
                placeholder={t("phonePlaceholder")}
                pattern="^\09\d{8}$"
                required
                aria-required="true"
              />
            </div>

            <div className="space-y-4 relative">
              <Label htmlFor="password" className="font-medium text-gray-700 dark:text-gray-200">{t("password")}</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  className={`${commonInputClasses} pr-10`}
                  value={registerData.password}
                  onChange={handleRegisterChange}
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
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div className="space-y-4">
              <Label htmlFor="bankId" className="font-medium text-gray-700 dark:text-gray-200">{t("bankId")}</Label>
              <Input
                type="text"
                id="bankId"
                name="bankId"
                className={commonInputClasses}
                value={registerData.bankId}
                onChange={handleRegisterChange}
                placeholder={t("bankIdPlaceholder")}
                required
                aria-required="true"
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="location" className="font-medium text-gray-700 dark:text-gray-200">{t("location")}</Label>
              <Input
                type="text"
                id="location"
                name="location"
                className={commonInputClasses}
                value={registerData.location}
                onChange={handleRegisterChange}
                placeholder={t("locationPlaceholder")}
                required
                aria-required="true"
              />
            </div>

            <div className="space-y-4">
              <Label htmlFor="categoryId" className="font-medium text-gray-700 dark:text-gray-200">{t("categoryId")}</Label>
              <div className="relative">
                <select
                  id="categoryId"
                  name="categoryId"
                  className={`${commonInputClasses} appearance-none w-full py-2 px-3 pr-10 focus:outline-none`}
                  value={registerData.categoryId}
                  onChange={handleRegisterChange}
                  required
                  aria-required="true"
                >
                  <option value="" disabled>
                    {t("categoryPlaceholder")}
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={String(category.id)}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Label htmlFor="description" className="font-medium text-gray-700 dark:text-gray-200">{t("description")}</Label>
              <Input
                type="text"
                id="description"
                name="description"
                className={commonInputClasses}
                value={registerData.description}
                onChange={handleRegisterChange}
                placeholder={t("descriptionPlaceholder")}
                required
                aria-required="true"
              />
            </div>
          </div>

          {/* Full-width File Inputs */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="space-y-4">
              <Label className="font-medium text-gray-700 dark:text-gray-200">{t("profilePhoto")}</Label>
              <div className="relative">
                <Input
                  type="file"
                  ref={profilePhotoInputRef}
                  name="profilePhoto"
                  onChange={handleRegisterChange}
                  className="hidden"
                  accept=".jpg,.jpeg,.png"
                  aria-required="true"
                />
                <div
                  onClick={() => handleFileButtonClick(profilePhotoInputRef)}
                  className={`flex items-center justify-center w-full rounded-[8px] border-2 border-dashed border-gray-300 dark:border-gray-600 py-4 sm:py-5 text-sm cursor-pointer bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 ${
                    registerData.profilePhoto ? "border-primary dark:border-primary-dark text-foreground dark:text-foreground-dark" : "text-muted-foreground dark:text-muted-dark"
                  }`}
                >
                  {registerData.profilePhoto ? (
                    <div className="flex items-center justify-between w-full px-4 sm:px-6">
                      <div className="flex items-center">
                        <Image className="h-5 w-5 text-primary dark:text-primary-dark mr-2" />
                        <span className="truncate max-w-[200px] sm:max-w-[250px]">
                          {registerData.profilePhoto.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile("profilePhoto")}
                        className="text-muted-foreground dark:text-muted-dark hover:text-destructive dark:hover:text-destructive transition-colors"
                        aria-label={t("removeFile")}
                      >
                        <FiX className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Image className="h-5 w-5 text-muted-foreground dark:text-muted-dark mr-2" />
                      <span>{t("chooseFile")}</span>
                    </div>
                  )}
                </div>
                {fileError.profilePhoto && (
                  <p className="text-destructive dark:text-destructive-dark text-sm mt-1">{t("fileRequired")}</p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <Label className="font-medium text-gray-700 dark:text-gray-200">{t("backgroundPhoto")}</Label>
              <div className="relative">
                <Input
                  type="file"
                  ref={backgroundPhotoInputRef}
                  name="backgroundPhoto"
                  onChange={handleRegisterChange}
                  className="hidden"
                  accept=".jpg,.jpeg,.png"
                  aria-required="true"
                />
                <div
                  onClick={() => handleFileButtonClick(backgroundPhotoInputRef)}
                  className={`flex items-center justify-center w-full rounded-[8px] border-2 border-dashed border-gray-300 dark:border-gray-600 py-4 sm:py-5 text-sm cursor-pointer bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-300 ${
                    registerData.backgroundPhoto ? "border-primary dark:border-primary-dark text-foreground dark:text-foreground-dark" : "text-muted-foreground dark:text-muted-dark"
                  }`}
                >
                  {registerData.backgroundPhoto ? (
                    <div className="flex items-center justify-between w-full px-4 sm:px-6">
                      <div className="flex items-center">
                        <Image className="h-5 w-5 text-primary dark:text-primary-dark mr-2" />
                        <span className="truncate max-w-[200px] sm:max-w-[250px]">
                          {registerData.backgroundPhoto.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile("backgroundPhoto")}
                        className="text-muted-foreground dark:text-muted-dark hover:text-destructive dark:hover:text-destructive transition-colors"
                        aria-label={t("removeFile")}
                      >
                        <FiX className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Image className="h-5 w-5 text-muted-foreground dark:text-muted-dark mr-2" />
                      <span>{t("chooseFile")}</span>
                    </div>
                  )}
                </div>
                {fileError.backgroundPhoto && (
                  <p className="text-destructive dark:text-destructive-dark text-sm mt-1">{t("fileRequired")}</p>
                )}
              </div>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2 space-y-4">
            <div className="text-center">
              <a href="/auth/login" className="text-sm text-primary dark:text-primary-dark hover:underline transition-colors">
                {t("loginLink")}
              </a>
            </div>

            <Button
              type="submit"
              className="w-full rounded-[8px] bg-primary dark:bg-primary-dark hover:bg-primary/90 dark:hover:bg-primary-dark/90 text-white font-semibold py-3 sm:py-4 transition-all duration-300 hover:shadow-md disabled:opacity-50"
              disabled={isLoading}
              aria-label={t("register")}
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
                t("register")
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}