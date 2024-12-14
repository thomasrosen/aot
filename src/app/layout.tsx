import { MainFrame } from "@/components/MainFrame";
import { ThemeProvider } from "@/components/client/ThemeProvider";
import { Header } from "@/components/server/Header";
import { Toaster } from "@/components/ui/sonner";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Ubuntu } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
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
    <html lang="en" suppressHydrationWarning={true}>
      <body
        className={`${ubuntu.className} antialiased min-h-screen min-w-screen`}
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <NuqsAdapter>
              <Header />
              <MainFrame>{children}</MainFrame>
              <Toaster />
            </NuqsAdapter>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
