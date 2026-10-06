import type { Metadata } from "next";
import { Be_Vietnam_Pro, Roboto_Mono } from "next/font/google";
import Providers from "./providers";

const sans = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
});

const mono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "Ngân hàng máu",
  description: "Hệ thống Quản lý Ngân hàng, Điều chuyển và Hiến máu",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="vi" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
