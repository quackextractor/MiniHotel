"use client"

interface VersionIndicatorProps {
  version: string
}

export function VersionIndicator({ version }: VersionIndicatorProps) {
  const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true"

  return (
    <div className={`fixed ${isDemo ? "bottom-10" : "bottom-4"} right-4 z-50 select-none rounded bg-muted/80 backdrop-blur px-2 py-0.5 text-[10px] font-mono text-muted-foreground border border-border shadow`}>
      v{version}
    </div>
  )
}
