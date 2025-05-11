"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import Head from "next/head";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function ForgotPassword() {

  const router = useRouter();

  const [loginData, setLoginData] = useState({
    phone: "",
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login submitted:", loginData);
    router.push("/auth/verify-code-password"); 
  };

  return (
    <>
      <Head>
        <title>Special Offers | Register Now</title>
        <meta name="description" content="Sign in to claim your exclusive discounts" />
      </Head>
      <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8">
          <h2 className="text-2xl font-bold text-center mb-2">Reset Your Password</h2>
          <p className="text-muted-foreground text-center mb-6">
            Enter your phone number to reset your password
          </p>

          <form onSubmit={handleLoginSubmit} className="space-y-5">
            {/* Phone Number */}
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
                className="bg-white rounded-[40px] border border-gray-300 focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-primary"
              />
            </div>
            <Button
              type="submit"
              className="w-full rounded-[40px] shadow-none cursor-pointer mt-4"
            >
              Send
            </Button>
          </form>
        </Card>
      </div>
    </>
  );
}