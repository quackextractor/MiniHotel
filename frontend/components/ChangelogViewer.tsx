"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"

interface ChangelogViewerProps {
  content: string
}

export function ChangelogViewer({ content }: ChangelogViewerProps) {
  // Split content by version header regex
  // Match ## [X.X.X] or #### [X.X.X]
  const chunks = content
    .split(/(?=##(?:##)?\s*\[)/)
    .map(chunk => chunk.trim())
    .filter(chunk => chunk.length > 0 && (chunk.includes("## [") || chunk.includes("#### [")))

  const [currentPage, setCurrentPage] = useState<number>(0)

  if (chunks.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border">
        <p className="text-sm text-muted-foreground">No changelog entries found.</p>
      </div>
    )
  }

  const handleSliderChange = (val: number[]) => {
    if (val && val.length > 0) {
      setCurrentPage(val[0])
    }
  }

  const handlePrev = () => {
    setCurrentPage(prev => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentPage(prev => Math.min(chunks.length - 1, prev + 1))
  }

  // Simple custom parser for Keep A Changelog Markdown format
  const renderMarkdown = (text: string) => {
    const lines = text.split("\n")
    const elements: React.ReactNode[] = []
    let listItems: React.ReactNode[] = []
    let listKey = 0

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${listKey++}`} className="list-disc pl-6 my-3 space-y-1.5 text-muted-foreground text-sm">
            {listItems}
          </ul>
        )
        listItems = []
      }
    }

    lines.forEach((line, index) => {
      const trimmed = line.trim()
      if (trimmed.startsWith("## ") || trimmed.startsWith("#### ")) {
        flushList()
        const cleanText = trimmed.replace(/^#+\s*/, "")
        elements.push(
          <h2 key={index} className="text-2xl font-bold text-foreground mt-4 mb-3 border-b border-border pb-1">
            {cleanText}
          </h2>
        )
      } else if (trimmed.startsWith("### ")) {
        flushList()
        const cleanText = trimmed.replace(/^###\s*/, "")
        elements.push(
          <h3 key={index} className="text-base font-semibold text-primary mt-4 mb-2">
            {cleanText}
          </h3>
        )
      } else if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const cleanText = trimmed.substring(2)
        listItems.push(<li key={index}>{cleanText}</li>)
      } else if (trimmed === "" || trimmed === "---") {
        flushList()
        if (trimmed === "---") {
          elements.push(<hr key={index} className="my-5 border-border" />)
        }
      } else {
        flushList()
        elements.push(<p key={index} className="my-2.5 text-sm text-muted-foreground leading-relaxed">{trimmed}</p>)
      }
    })

    flushList()
    return elements
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full h-[calc(100vh-12rem)] min-h-[450px]">
      <Card className="flex flex-1 flex-col overflow-hidden h-full">
        <CardHeader className="shrink-0">
          <CardTitle className="text-3xl font-bold">Changelog</CardTitle>
          <CardDescription>Browse through release versions and changes</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-6 overflow-hidden min-h-0 pb-6">
          {/* Main content display */}
          <div key={currentPage} className="flex-1 overflow-y-auto pr-4">
            {renderMarkdown(chunks[currentPage])}
          </div>

          {/* Slider controller */}
          <div className="space-y-2 pt-2 shrink-0">
            <div className="flex justify-between text-xs text-muted-foreground font-mono">
              <span>First Version</span>
              <span>Entry {currentPage + 1} of {chunks.length}</span>
              <span>Latest Version</span>
            </div>
            <Slider
              value={[currentPage]}
              max={chunks.length - 1}
              step={1}
              onValueChange={handleSliderChange}
            />
          </div>

          {/* Pagination controls */}
          <Pagination className="pt-2 shrink-0">
            <PaginationContent className="w-full justify-between">
              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrev}
                  disabled={currentPage === 0}
                  className="gap-1"
                >
                  Previous
                </Button>
              </PaginationItem>
              <PaginationItem>
                <span className="text-sm font-medium">
                  Page {currentPage + 1} / {chunks.length}
                </span>
              </PaginationItem>
              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNext}
                  disabled={currentPage === chunks.length - 1}
                  className="gap-1"
                >
                  Next
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardContent>
      </Card>
    </div>
  )
}
