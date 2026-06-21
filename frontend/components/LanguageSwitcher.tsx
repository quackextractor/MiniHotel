"use client"

import { useRouter, usePathname } from "@/i18n/routing"
import { useParams } from "next/navigation"
import localesData from "@/i18n/locales.json"

import { useSettings } from "@/lib/settings-context"

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useParams()
  const currentLocale = (params?.locale as string) || "en"
  const { updateSettings } = useSettings()

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLocale = e.target.value
    updateSettings({ language: newLocale })
    router.replace(pathname, { locale: newLocale })
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
        {localesData.map((loc) => (
          <option key={loc.code} value={loc.code}>
            {loc.flag ? `${loc.flag} ` : ''}{loc.name}
          </option>
        ))}
      </select>
    </div>
  )
}
