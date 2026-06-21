"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "@/i18n/routing"

export function PrivacyPolicy() {
  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true"
  const router = useRouter()

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
          <CardDescription>GDPR and data processing information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed">
          {isDemo ? (
            <p className="font-semibold text-red-500">
              System runs in Demo Mode. Data stored in browser localStorage. External servers receive zero data.
            </p>
          ) : (
            <p>
              Standard server processing active. Data is transmitted securely and stored in my database.
            </p>
          )}
          <p>
            I take user privacy and GDPR compliance seriously. Under the General Data Protection Regulation (GDPR), individuals (including hotel guests and system users) have rights concerning their personal data, including the right to access, rectify, or erase their personal information.
          </p>
          <p>
            Specifically, this MiniHotel application manages guest profiles (names, emails, phones), room configurations, booking schedules, seasonal rates, service orders, and action audit logs.
          </p>
          <p>
            In demo mode, you have complete control over your data since everything is kept on your device. Clearing your browser cache or site data will immediately and permanently erase all rooms, guests, bookings, and other data records.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4 pt-4">
          <Button variant="outline" onClick={() => router.back()}>
            Go Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
