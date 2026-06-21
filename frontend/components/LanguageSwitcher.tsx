"use client"

import { useRouter, usePathname } from "@/i18n/routing"
import { useParams } from "next/navigation"

const locales = ['en', 'cs', 'de'] as const

const localeLabels: Record<string, string> = {
  en: "EN",
  cs: "CS",
  de: "DE",
}

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const currentLocale = (params?.locale as string) || "en"

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.replace(pathname, { locale: e.target.value })
  }

  return (
    <div className="absolute top-4 right-4">
      <select
        id="language-switcher"
        value={currentLocale}
        onChange={handleChange}
        className="rounded border border-border bg-background text-foreground text-sm px-2 py-1 cursor-pointer focus:outline-none focus:ring-1 focus:ring-ring"
        aria-label="Select language"
      >
        {locales.map((locale) => (
          <option key={locale} value={locale}>
            {localeLabels[locale]}
          </option>
        ))}
      </select>
    </div>
  )
}
