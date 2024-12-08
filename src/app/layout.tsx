import { MainFrame } from "@/components/MainFrame";
import { Header } from "@/components/server/Header";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Ubuntu } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";

// If loading a variable font, you don't need to specify the font weight
const ubuntu = Ubuntu({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Inventory",
  description: "Keep track of physical objects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning={true}>
      <body className={`${ubuntu.className} antialiased`}>
        <Suspense>
          <Header />
        </Suspense>
        <MainFrame>
          <SessionProvider>{children}</SessionProvider>
        </MainFrame>
        <Toaster />
      </body>
    </html>
  );
}
