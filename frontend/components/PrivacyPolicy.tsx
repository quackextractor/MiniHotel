"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "@/i18n/routing"
import { useTranslations } from "next-intl"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"

export function PrivacyPolicy() {
  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true"
  const router = useRouter()
  const t = useTranslations("Privacy")

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      <LanguageSwitcher />
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed">
          {isDemo ? (
            <p className="font-semibold text-red-500">
              {t("demoMode")}
            </p>
          ) : (
            <p>
              {t("standardMode")}
            </p>
          )}
          <p>
            {t("gdprNotice")}
          </p>
          <p>
            {t("dataDetails")}
          </p>
          <p>
            {t("demoDataControl")}
          </p>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4 pt-4">
          <Button variant="outline" onClick={() => router.back()}>
            {t("goBack")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
