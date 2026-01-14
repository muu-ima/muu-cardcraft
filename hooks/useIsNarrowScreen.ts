import { useEffect, useState } from "react";

export const useIsNarrowScreen = (maxWidth = 1280) => {
  const [isNarrow, setIsNarrow] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia(`(max-width: ${maxWidth}px)`);
    const update = () => setIsNarrow(mq.matches);

    update(); // 初期判定

    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [maxWidth]);

  return isNarrow;
};
