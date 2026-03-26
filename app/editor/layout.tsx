import type { ReactNode } from "react";
import {
  notoSansJp,
  zenMaruGothic,
  notoSerifJp,
  zenKakuGothicNew,
  parisienne,
  dancingScript,
  lemon,
  chicle,
  potta_one,
} from "@/app/fonts";

export default function EditorLayout({ children }: { children: ReactNode }) {
  const fontClasses = [
    notoSansJp.variable,
    zenMaruGothic.variable,
    notoSerifJp.variable,
    zenKakuGothicNew.variable,
    parisienne.variable,
    dancingScript.variable,
    lemon.variable,
    chicle.variable,
    potta_one.variable,
  ].join(" ");

  return (
    <div className={`${fontClasses} flex h-full min-h-0 flex-col`}>
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
