"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { FiPaperclip, FiX } from "react-icons/fi";
import { Eye, EyeOff } from "lucide-react";

// Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Types
interface FormData {
  phone: string;
  password: string;
}

interface RegisterData extends FormData {
  email: string;
  commercialRegistration: File | null;
}

interface RightAuthFormProps {
  defaultTab?: "login" | "register";
}

export default function RightAuthForm({
  defaultTab = "login",
}: RightAuthFormProps) {
  // State
  const [fileError, setFileError] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    login: false,
    register: false,
    confirm: false,
  });
  const [loginData, setLoginData] = useState<FormData>({
    phone: "",
    password: "",
  });
  const [registerData, setRegisterData] = useState<RegisterData>({
    email: "",
    phone: "",
    password: "",
    commercialRegistration: null,
  });

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handlers
  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (e.target.type === "file" && files?.[0]) {
      setRegisterData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setRegisterData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileButtonClick = () => fileInputRef.current?.click();

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRegisterData((prev) => ({ ...prev, commercialRegistration: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login submitted:", loginData);
    alert("Login successful!");
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!registerData.commercialRegistration) {
      setFileError(true);
      return;
    }

    setFileError(false);
    console.log("Register submitted:", registerData);
    alert("Registration successful!");
  };

  // Constants
  const commonInputClasses =
    "bg-white rounded-[40px] border border-gray-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary";
  const tabTriggerClasses =
    "rounded-[40px] h-7 data-[state=active]:bg-primary data-[state=active]:text-white bg-transparent transition-colors duration-200 cursor-pointer";

  return (
    <div className="md:w-1/2 p-8 sm:px-16 flex flex-col justify-start">
      <Tabs defaultValue={defaultTab} className="w-full flex justify-center">
        <div className="w-full flex justify-center">
          <TabsList className="grid w-90 grid-cols-2 rounded-[40px] p-[6px] h-10 mb-6 bg-primary/20">
            <TabsTrigger value="login" className={tabTriggerClasses}>
              Login
            </TabsTrigger>
            <TabsTrigger value="register" className={tabTriggerClasses}>
              Register
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Login Tab */}
        <TabsContent value="login">
          <p className="text-muted-foreground mb-6">
            Login now as a provider to publish your services.
          </p>

          <form onSubmit={handleLoginSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                value={loginData.phone}
                onChange={handleLoginChange}
                placeholder="+9639********"
                title="Enter a valid Syrian phone number starting with +9639"
                pattern="^\09\d{8}$"
                required
                className={commonInputClasses}
              />
            </div>

            <div className="space-y-2 relative">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  type={showPasswords.login ? "text" : "password"}
                  id="password"
                  name="password"
                  className={`${commonInputClasses} pr-10`}
                  value={loginData.password}
                  onChange={handleLoginChange}
                  placeholder="••••••••"
                  title="Enter your password"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary"
                  onClick={() => togglePasswordVisibility("login")}
                >
                  {showPasswords.login ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <Link
                href="/auth/forget-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div></div>
              <Button
                type="submit"
                className="w-full rounded-[40px] shadow-none cursor-pointer"
              >
                Login
              </Button>
            </div>
          </form>
        </TabsContent>

        {/* Register Tab */}
        <TabsContent value="register">
          <p className="text-muted-foreground mb-8">
            Register now as a provider to publish your services.
          </p>

          <form onSubmit={handleRegisterSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                type="email"
                id="email"
                name="email"
                className={commonInputClasses}
                value={registerData.email}
                onChange={handleRegisterChange}
                placeholder="your@email.com"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                className={commonInputClasses}
                value={registerData.phone}
                onChange={handleRegisterChange}
                title="Enter a valid Syrian phone number starting with +9639"
                pattern="^\09\d{8}$"
                placeholder="09********"
                required
              />
            </div>

            <div className="space-y-2 relative">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  type={showPasswords.register ? "text" : "password"}
                  id="password"
                  name="password"
                  className={`${commonInputClasses} pr-10`}
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  className="cursor-pointer absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-primary"
                  onClick={() => togglePasswordVisibility("register")}
                >
                  {showPasswords.register ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Commercial Registration</Label>
              <div className="relative">
                <Input
                  type="file"
                  ref={fileInputRef}
                  name="commercialRegistration"
                  onChange={handleRegisterChange}
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                />
                <div
                  onClick={handleFileButtonClick}
                  className={`flex items-center w-full rounded-[40px] border px-3 py-2 text-sm shadow-xs/5 cursor-pointer bg-transparent transition-colors duration-150 ${
                    registerData.commercialRegistration
                      ? "border-primary text-foreground"
                      : "border-input text-muted-foreground"
                  }`}
                >
                  {registerData.commercialRegistration ? (
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <FiPaperclip className="h-4 w-4 text-primary mr-2" />
                        <span className="truncate">
                          {registerData.commercialRegistration.name}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="text-muted-foreground hover:text-destructive ml-2 cursor-pointer"
                      >
                        <FiX className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <FiPaperclip className="h-4 w-4 mr-2" />
                      <span>Choose file...</span>
                    </div>
                  )}
                </div>
              </div>
              {fileError && (
                <p className="text-destructive text-sm mt-1">
                  This file is required.
                </p>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div></div>
              <Button
                type="submit"
                className="w-full rounded-[40px] shadow-none cursor-pointer"
              >
                Register
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
