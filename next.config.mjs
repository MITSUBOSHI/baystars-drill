/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: process.env.CAPACITOR === "true" ? "" : "/baystars-drill",
};

export default nextConfig;
