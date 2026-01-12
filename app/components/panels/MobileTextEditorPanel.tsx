"use client";

import { useState } from "react";
import { CircleCheckBig } from "lucide-react";

type Props = {
  blockId: string;
  initialValue: string;
  title: string;
  description?: string;
  placeholder?: string;
  preview?: (draft: string) => React.ReactNode;
  onCommit: (id: string, draft: string) => void;
};

export function MobileTextEditorPanel({
  blockId,
  initialValue,
  title,
  description,
  placeholder,
  preview,
  onCommit,
}: Props) {
  const [draft, setDraft] = useState(initialValue);

  const handleInsertNewline = () => {
    setDraft((prev) => prev + "\n");
  };

  return (
    <div className="space-y-3 rounded-t-2xl bg-white p-4">
      <header className="flex items-center justify-between text-sm">
        <div>
          <p className="font-medium">{title}</p>
          {description && (
            <p className="text-xs text-zinc-500">{description}</p>
          )}
        </div>
      </header>

      <textarea
        className="w-full rounded-md border border-zinc-200 bg-white p-2 text-sm"
        rows={3}
        enterKeyHint="enter"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder={placeholder}
      />

      {preview && (
        <div className="min-h-6 text-xs text-zinc-500">{preview(draft)}</div>
      )}

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleInsertNewline}
          className="flex-1 rounded-lg border border-zinc-300 py-1.5 text-xs"
        >
          改行を挿入
        </button>

        <button
          type="button"
          onClick={() => onCommit(blockId, draft)}
          className="flex-1 rounded-lg bg-zinc-900 py-1.5 text-xs font-medium text-white hover:bg-zinc-800"
        >
          <CircleCheckBig className="h-4 w-4" />
          完了
        </button>
      </div>
    </div>
  );
}
