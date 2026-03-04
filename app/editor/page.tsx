// app/editor/page.tsx
import CardEditor from "./CardEditor";

type SearchParams = Promise<{ code?: string }>;

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const code = sp?.code ?? "";
  return <CardEditor code={code} />;
}
