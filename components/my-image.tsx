import { useState } from "react";
import Image from "next/image";

const FALLBACK_IMAGE =
  "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/chorizo-mozarella-gnocchi-bake-cropped-9ab73a3.jpg";

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
