import type { Metadata, Viewport } from "next";
import { Noto_Sans_SC, Noto_Serif_SC } from "next/font/google";
import "./globals.css";

const sans = Noto_Sans_SC({
  variable: "--font-sans",
  subsets: ["latin"],
});

const serif = Noto_Serif_SC({
  variable: "--font-serif",
  subsets: ["latin"],
});

const OG_IMAGE = {
  url: "/og.jpg",
  width: 1200,
  height: 675,
  alt: "一枚心脏解剖标本悬浮在基座上方，旁边是“解剖工坊”字样",
};

/**
 * Absolute URLs for og:image and friends. Resolved per host so a preview
 * deployment does not advertise another origin's assets:
 *   1. NEXT_PUBLIC_SITE_URL — explicit override, wins everywhere
 *   2. VERCEL_PROJECT_PRODUCTION_URL — the project's stable production domain
 *   3. the original Cloudflare/OpenAI host
 */
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://anatomy-atelier.openai.site");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "解剖工坊 — 人体器官 3D 图鉴",
  description:
    "通过优雅的交互式 3D 标本，浏览心脏、大脑、肺、肝、肾、眼、肠、胰与皮肤等人体器官的介绍与结构。",
  applicationName: "解剖工坊",
  keywords: ["解剖", "3D 解剖", "人体器官", "器官结构", "医学教育", "交互式学习"],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.svg",
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
  },
  openGraph: {
    type: "website",
    siteName: "解剖工坊",
    title: "解剖工坊 — 人体器官 3D 图鉴",
    description: "通过沉浸式的 3D 标本，浏览人体器官的介绍与结构。",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "解剖工坊 — 人体器官 3D 图鉴",
    description: "通过沉浸式的 3D 标本，浏览人体器官的介绍与结构。",
    images: [OG_IMAGE],
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f0e7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${sans.variable} ${serif.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
