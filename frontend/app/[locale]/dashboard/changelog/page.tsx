import { getChangelogContent } from "@/app/actions/changelog"
import { ChangelogViewer } from "@/components/ChangelogViewer"

export default async function ChangelogPage() {
  const content = await getChangelogContent()
  return <ChangelogViewer content={content} />
}
