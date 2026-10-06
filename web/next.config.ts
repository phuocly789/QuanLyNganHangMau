import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Driver SQL Server chạy phía server, không đóng gói qua bundler
  serverExternalPackages: ["mssql", "tedious", "msnodesqlv8"],
};

export default nextConfig;
