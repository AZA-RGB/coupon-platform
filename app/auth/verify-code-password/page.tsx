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

export default function VerifyOTP() {
  const [otp, setOtp] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("OTP submitted:", otp);
    // Add your verification logic here
    router.push("/auth/reset-password"); // Redirect to password reset page
  };

  const handleResend = () => {
    console.log("Resending OTP...");
    // Add your resend logic here
  };

  return (
    <>
      <Head>
        <title>Verify OTP | Password Reset</title>
        <meta name="description" content="Verify OTP to reset your password" />
      </Head>

      <div className="min-h-screen flex items-center justify-center bg-muted/40 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Verify OTP</CardTitle>
            <CardDescription className="text-muted-foreground">
              Enter the 5-digit code sent to your phone
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
                >
                  <InputOTPGroup className="gap-3">
                    {[...Array(5)].map((_, i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className="h-12 w-12 text-xl border border-border rounded-[12px] shadow-sm focus:ring-2 focus:ring-primary focus:border-primary ring-offset-0 transition-all duration-150"
                        />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <div className="w-full flex justify-center">
                <Button
                  type="submit"
                  className="rounded-[40px] w-80 cursor-pointer"
                >
                  Verify
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground ">
                Didnt receive code?{" "}
                <Button
                  variant="link"
                  className="p-0 text-primary h-auto cursor-pointer"
                  onClick={handleResend}
                >
                  Resend OTP
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
