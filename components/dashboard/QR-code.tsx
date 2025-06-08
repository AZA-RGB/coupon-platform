"use client";

import QRCode from "react-qr-code";

export default function QRCodeComp({ value, size }) {
  return (
    <QRCode
      className="border border-red-50"
      value={value}
      size={size}
      // level="H" // Error correction level
      fgColor=""
    />
  );
}
