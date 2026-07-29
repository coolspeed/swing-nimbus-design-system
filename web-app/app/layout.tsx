import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);
  const preview = new URL("/og.png", base).toString();

  return {
    metadataBase: base,
    title: "Nimbus Swing Design System — Web Edition",
    description: "A high-fidelity React recreation of Java Swing's Nimbus Look & Feel.",
    openGraph: {
      title: "Nimbus Swing Design System — Web Edition",
      description: "Java Swing's Nimbus Look & Feel, faithfully rebuilt for the modern web.",
      type: "website",
      images: [{ url: preview, width: 1672, height: 941, alt: "Nimbus Swing web design system" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "Nimbus Swing Design System — Web Edition",
      description: "Java Swing's Nimbus Look & Feel, faithfully rebuilt for the modern web.",
      images: [preview],
    },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
