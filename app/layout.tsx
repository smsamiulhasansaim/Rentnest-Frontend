import type { Metadata } from "next";
import "./globals.css";
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { AuthProvider } from '@/providers/AuthProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import ToastProvider from '@/providers/ToastProvider';

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
    <html lang="en">
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          <AuthProvider>
            <ToastProvider>
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </ToastProvider>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}