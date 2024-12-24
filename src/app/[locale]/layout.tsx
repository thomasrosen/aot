import { MainFrame } from "@/components/MainFrame";
import { GlobalStoreProvider } from "@/components/client/GlobalStoreProvider";
import { ThemeProvider } from "@/components/client/ThemeProvider";
import { TranslationProvider } from "@/components/client/Translation";
import { Header } from "@/components/server/Header";
import { Toaster } from "@/components/ui/sonner";
import { loadMessages } from "@/lib/server/fluent-server";
import { getLocale } from "@/lib/server/getLocale";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Ubuntu } from "next/font/google";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import "./globals.css";

// export const dynamic = "force-dynamic";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await loadMessages(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
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
              <TranslationProvider locale={locale} messages={messages}>
                <GlobalStoreProvider>
                  <Header />
                  <MainFrame>{children}</MainFrame>
                  <Toaster richColors closeButton />
                </GlobalStoreProvider>
              </TranslationProvider>
            </NuqsAdapter>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
