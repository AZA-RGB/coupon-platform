import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    domains: ["images.immediate.co.uk","img.youtube.com","via.placeholder.com"],
  },
  locales: ["en", "ar"],
  defaultLocale: "en",
  localeDetection: true,
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
