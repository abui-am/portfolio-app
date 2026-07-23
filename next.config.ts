import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow ngrok (and similar) to load dev assets / HMR when sharing the dev server.
  allowedDevOrigins: ["*.ngrok-free.app", "*.ngrok.io", "*.ngrok.app"],
};

export default nextConfig;
