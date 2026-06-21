"use client"

export function DemoBadge() {
  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true"

  if (!isDemo) return null

  return (
    <div className="fixed top-4 right-4 z-[9999] select-none rounded-full bg-red-600 px-3 py-1 text-xs font-bold text-white shadow-lg animate-pulse border border-red-500">
      DEMO MODE
    </div>
  )
}
