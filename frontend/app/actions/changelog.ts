"use server"

import fs from "fs"
import path from "path"

export async function getLatestVersion() {
  try {
    // Try root CHANGELOG.md first, then frontend/changelog.md
    let changelogPath = path.join(process.cwd(), "..", "CHANGELOG.md")
    if (!fs.existsSync(changelogPath)) {
      changelogPath = path.join(process.cwd(), "changelog.md")
    }
    if (!fs.existsSync(changelogPath)) {
      changelogPath = path.join(process.cwd(), "CHANGELOG.md")
    }

    const content = fs.readFileSync(changelogPath, "utf-8")
    // Match ## [X.X.X] or #### [X.X.X]
    const match = content.match(/##(?:##)?\s*\[([^\]]+)\]/)
    return match ? match[1] : "0.9.1"
  } catch (error) {
    console.error("Failed to read CHANGELOG.md:", error)
    return "0.9.1"
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
