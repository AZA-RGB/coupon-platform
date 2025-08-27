const nextConfig = {
  images: {
    domains: [
      "images.immediate.co.uk",
      "cdn.pixabay.com",
      "img.youtube.com",
      "via.placeholder.com",
      "ecoupon-files.sfo3.cdn.digitaloceanspaces.com",
    ],
    remotePatterns: [new URL("http://164.92.67.78:3002/images/**")],
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://164.92.67.78:3000/api/:path*",
      },
    ];
  },
  locales: ["en", "ar"],
  defaultLocale: "en",
  localeDetection: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

const withNextIntl = require("next-intl/plugin")();
module.exports = withNextIntl(nextConfig);
