import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/components/providers/QueryProvider";
import { Toaster } from "sonner";
import { Sidebar } from "@/components/Sidebar"; 
import { Header } from "@/components/Header";   

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EventHive Dashboard",
  description: "Event Management Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryProvider>
          <div className="flex min-h-screen bg-gray-50/50">
            <Sidebar /> 
            <main className="flex-1 ml-64 flex flex-col">
              <Header /> 
              <div className="flex-1 overflow-auto">
                {children} 
              </div>
            </main>
          </div>
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}