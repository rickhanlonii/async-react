import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Async React",
  icons: { icon: "/logo.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=0.8" />
      </head>
      <body>{children}</body>
    </html>
  );
}
