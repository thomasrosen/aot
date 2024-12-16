import { MainFrame } from "@/components/MainFrame";
import { ThemeProvider } from "@/components/client/ThemeProvider";
import { TranslationProvider } from "@/components/client/Translation";
import { Header } from "@/components/server/Header";
import { Toaster } from "@/components/ui/sonner";
import { loadMessages } from "@/lib/server/fluent-server";
import { DEFAULT_LOCALE, Locale } from "@@/i18n-config";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Ubuntu } from "next/font/google";
import { headers } from "next/headers";
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = ((await headers()).get("x-locale") ||
    DEFAULT_LOCALE) as Locale;
  const messages = await loadMessages(locale);

  return (
    <html lang={locale} suppressHydrationWarning={true}>
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
                <Header locale={locale} />
                <MainFrame>{children}</MainFrame>
                <Toaster richColors closeButton />
              </TranslationProvider>
            </NuqsAdapter>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
