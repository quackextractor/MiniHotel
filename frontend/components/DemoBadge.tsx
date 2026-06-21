"use client"

export function DemoBadge() {
  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true"

  if (!isDemo) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 select-none rounded bg-purple-500/10 backdrop-blur px-2 py-0.5 text-[10px] font-mono text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/80 shadow">
      Demo Mode
    </div>
  )
}
