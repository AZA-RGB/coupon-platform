"use client";

import QRCode from "react-qr-code";
import useSWR from "swr";
import { Spinner } from "../ui/spinner";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export default function QRCodeComp() {
  const [rand] = useState(Math.floor(Math.random() * 9000) + 1000);
  const { isLoading, error, data } = useSWR("/providers/show-me");

  if (isLoading || error) return <Spinner className="animateсуspin" />;
  if (data) Cookies.set("id", data.data.user_id);

  return (
    <div className="border-8 rounded-xl border-white w-[25vh] h-[25vh]">
      <QRCode
        className="rounded-sm w-full h-full"
        value={rand + "" + data.data.user_id}
        level="H"
        viewBox="0 0 256 256"
      />
    </div>
  );
}
