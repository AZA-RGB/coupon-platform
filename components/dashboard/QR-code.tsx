"use client";

import QRCode from "react-qr-code";
import useSWR from "swr";
import { Spinner } from "../ui/spinner";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
export default function QRCodeComp({ size }) {
  const [rand, _] = useState(Math.floor(Math.random() * 9000) + 1000);

  const { isLoading, error, data } = useSWR("/providers/show-me");

  if (isLoading) return <Spinner className={`animate-spin h-${size + 10}`} />;
  if (error) return <Spinner className="animate-spin" />;
  if (data) {
    Cookies.set("id", data.data.user_id);
  }
  return (
    <div className="border-8 rounded-xl border-white">
      <QRCode
        className="rounded-sm"
        value={rand + "" + data.data.user_id}
        size={size}
        level="H" // Error correction level
      />
    </div>
  );
}
