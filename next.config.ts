import path from "path";
import type { NextConfig } from "next";

const emptyPolyfill = "./lib/empty-polyfill.js";
const emptyPolyfillAbsolute = path.join(__dirname, "lib/empty-polyfill.js");

const nextConfig: NextConfig = {
  // Allow ngrok (and similar) to load dev assets / HMR when sharing the dev server.
  allowedDevOrigins: ["*.ngrok-free.app", "*.ngrok.io", "*.ngrok.app"],
  turbopack: {
    resolveAlias: {
      "../build/polyfills/polyfill-module": emptyPolyfill,
      "next/dist/build/polyfills/polyfill-module": emptyPolyfill,
    },
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "../build/polyfills/polyfill-module": emptyPolyfillAbsolute,
      "next/dist/build/polyfills/polyfill-module": emptyPolyfillAbsolute,
    };
    return config;
  },
};

export default nextConfig;
