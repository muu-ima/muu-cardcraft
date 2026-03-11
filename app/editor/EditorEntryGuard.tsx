"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  EDITOR_SESSION_KEY,
  type StoredEditorSession,
} from "@/shared/editorSession";

export default function EditorEntryGuard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const saveSession = (code: string) => {
      const payload: StoredEditorSession = {
        code,
        updatedAt: Date.now(),
      };
      localStorage.setItem(EDITOR_SESSION_KEY, JSON.stringify(payload));
    };

    const urlCode = searchParams.get("code");

    if (urlCode) {
      saveSession(urlCode);
      return;
    }

    const raw = localStorage.getItem(EDITOR_SESSION_KEY);

    if (raw) {
      try {
        const parsed = JSON.parse(raw) as StoredEditorSession;

        if (parsed?.code) {
          saveSession(parsed.code);
          router.replace(`/editor?code=${parsed.code}`);
          return;
        }
      } catch {
        localStorage.removeItem(EDITOR_SESSION_KEY);
      }
    }

    const tempCode = `draft-${Date.now()}`;
    saveSession(tempCode);
    router.replace(`/editor?code=${tempCode}`);
  }, [router, searchParams]);

  return (
    <div className="flex min-h-[40vh] items-center justify-center text-sm text-zinc-500">
      編集データを準備しています...
    </div>
  );
}
