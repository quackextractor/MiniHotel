"use client"

export function DemoBadge() {
  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true"

  if (!isDemo) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] border-4 border-dashed border-red-500/30 m-1 rounded-lg">
      <div className="absolute top-2 right-4 bg-red-500/10 backdrop-blur-xs text-[10px] font-mono text-red-500/60 px-2 py-0.5 rounded border border-red-500/20 uppercase tracking-widest font-bold">
        Demo Mode
      </div>
    </div>
  )
}
