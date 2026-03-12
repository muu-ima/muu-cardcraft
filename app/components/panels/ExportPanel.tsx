// app/components/panels/ExportPanel.tsx
"use client";

import PanelSection from "@/app/components/panels/PanelSection";
import ExportTab from "@/app/components/tabs/ExportTab";

export default function ExportPanel({
  onDownload,
}: {
  onDownload: (format: "png" | "jpeg") => void;
}) {
  return (
    <div className="space-y-4">
      <PanelSection title="書き出し" desc="画像として保存します。">
        <ExportTab onDownload={onDownload} />
      </PanelSection>
    </div>
  );
}
