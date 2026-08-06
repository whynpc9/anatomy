import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The application has no request-time data or server-only routes. Exporting
  // it as HTML keeps every production request on Cloudflare Static Assets and
  // avoids consuming the Workers execution quota.
  output: "export",
};

export default nextConfig;
