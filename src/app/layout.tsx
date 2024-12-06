import { auth } from "@/auth";
import { Header } from "@/components/Header";
import { MainFrame } from "@/components/MainFrame";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Ubuntu } from "next/font/google";
import "./globals.css";

// If loading a variable font, you don't need to specify the font weight
const ubuntu = Ubuntu({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Inventar",
  description: "Keep track of physical objects.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <html lang="en" className="dark">
        <body className={`${ubuntu.className} antialiased`}>
          <Header />
          <MainFrame>{children}</MainFrame>
          <Toaster />
        </body>
      </html>
    </SessionProvider>
  );
}
