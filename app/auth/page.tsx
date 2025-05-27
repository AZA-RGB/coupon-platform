"use client";
import Head from "next/head";
import RightAuthForm from "@/components/auth/right-side-auth";

export default function Auth() {
  return (
    <>
      <Head>
        <title>Special Offers | Register Now</title>
        <meta name="description" content="Sign in to claim your exclusive discounts" />
      </Head>

      <div className="min-h-screen bg-muted/40">
        <div className="w-full min-h-screen flex  items-center justify-center">
          {/* <ExclusiveOffers /> */}
          
          <RightAuthForm defaultTab="login" />
        </div>
      </div>
    </>
  );
}