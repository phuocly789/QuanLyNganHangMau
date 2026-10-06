import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // msnodesqlv8 là module native (.node), không đóng gói qua bundler
  serverExternalPackages: ["mssql", "msnodesqlv8"],
};

export default nextConfig;
