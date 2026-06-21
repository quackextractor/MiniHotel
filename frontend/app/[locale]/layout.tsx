import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { SettingsProvider } from "@/lib/settings-context"
import { AuthProvider } from "@/contexts/AuthContext"
import { AutoLogoutManager } from "@/components/auto-logout-manager"
import { Toaster } from "@/components/ui/sonner"
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { I18nAuditLoader } from "@/components/i18n-audit-loader"
import { DemoBadge } from "@/components/DemoBadge"
import { VersionIndicator } from "@/components/VersionIndicator"
import { getLatestVersion } from "@/app/actions/changelog"
import "../globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Minihotel Management System",
  description: "Professional hotel management system for bookings, rooms, and operations",
  generator: "MiniHotel",
  icons: {
    icon: "/favicon.ico",
  },
}

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params;
  const messages = await getMessages();
  const version = await getLatestVersion();

  return (
    <html lang={locale} className="dark" suppressHydrationWarning>
      <body className={`font-sans antialiased`} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <SettingsProvider>
              <AutoLogoutManager />
              <DemoBadge />
              {children}
              <Toaster />
              <I18nAuditLoader />
              <VersionIndicator version={version} />
            </SettingsProvider>
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
