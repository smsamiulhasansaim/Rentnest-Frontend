import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rentnest",
  description: "Codex by Rentnest-Frontend",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
