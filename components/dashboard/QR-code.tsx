"use client";

import QRCode from "react-qr-code";

export default function QRCodeComp({ value, size }) {
  return (
    <div className=" border-8 rounded-xl border-white">
      <QRCode
        className="rounded-sm"
        value={value}
        size={size}
        // level="H" // Error correction level
      />
    </div>
  );
}
