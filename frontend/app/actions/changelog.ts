"use server"

import fs from "fs"
import path from "path"

function resolveRootDir(): string {
  // process.cwd() is frontend/ when running next dev/build
  // Go one level up to reach the repo root
  const fromFrontend = path.join(process.cwd(), "..")
  if (fs.existsSync(path.join(fromFrontend, "VERSION.txt"))) {
    return fromFrontend
  }
  // Fallback: VERSION.txt sits alongside next.config in the same dir (monorepo variant)
  return process.cwd()
}

export async function getLatestVersion(): Promise<string> {
  try {
    const root = resolveRootDir()
    const versionFile = path.join(root, "VERSION.txt")
    if (fs.existsSync(versionFile)) {
      return fs.readFileSync(versionFile, "utf-8").trim()
    }
    // Fallback: parse first version tag from CHANGELOG.md
    const changelogFile = path.join(root, "CHANGELOG.md")
    if (fs.existsSync(changelogFile)) {
      const content = fs.readFileSync(changelogFile, "utf-8")
      const match = content.match(/##(?:##)?\s*\[([^\]]+)\]/)
      if (match) return match[1]
    }
    return "0.0.0"
  } catch (error) {
    console.error("Failed to read version:", error)
    return "0.0.0"
  }
}


export async function getChangelogContent() {
  try {
    let changelogPath = path.join(process.cwd(), "..", "CHANGELOG.md")
    if (!fs.existsSync(changelogPath)) {
      changelogPath = path.join(process.cwd(), "changelog.md")
    }
    if (!fs.existsSync(changelogPath)) {
      changelogPath = path.join(process.cwd(), "CHANGELOG.md")
    }
    return fs.readFileSync(changelogPath, "utf-8")
  } catch (error) {
    console.error("Failed to read changelog content:", error)
    return ""
  }
}
