import { AntdRegistry } from "@ant-design/nextjs-registry";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  description:
    "easy_resume 是一款在线简历编辑器，支持在线编辑、简历模板选择和一键导出 PDF，适合应届生和职场人士使用。",
  openGraph: {
    description:
      "easy_resume 是一款在线简历编辑器，支持在线编辑、简历模板选择、ai测评和一键导出 PDF，适合应届生和职场人士使用。",
    images: [
      {
        height: 703,
        url: "/page.png",
        width: 1342,
      },
    ],
    title: "在线简历编辑器 easy_resume",
  },
  title: "在线简历编辑器 easy_resume",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} overflow-hidden antialiased`}
      >
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
