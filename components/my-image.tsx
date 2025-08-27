import { useState } from "react";
import Image from "next/image";

const FALLBACK_IMAGE =
  "https://cdn.pixabay.com/photo/2022/04/22/01/04/ticket-7148607_960_720.png";

export default function MyImage({ src, alt }) {
  const [imgSrc, setImgSrc] = useState(src || FALLBACK_IMAGE);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill
      className="object-cover"
      onError={() => setImgSrc(FALLBACK_IMAGE)}
    />
  );
}
