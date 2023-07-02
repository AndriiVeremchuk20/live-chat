"use client";

import "./globals.css";
import Header from "@/components/Header";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <html lang="en">
        <body className="min-h-screen max-h-fit bg-gradient-to-r from-indigo-700 via-purple-900 to-pink-700">
          <Header />
          {children}
        </body>
      </html>
    </QueryClientProvider>
  );
}
