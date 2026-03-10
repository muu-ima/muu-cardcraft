import CardEditor from "./CardEditor";
import EditorEntryGuard from "./EditorEntryGuard";

type SearchParams = Promise<{ code?: string }>;

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const code = sp?.code?.trim() ?? "";

  if (!code) {
    return <EditorEntryGuard />;
  }

  return <CardEditor code={code} />;
}
