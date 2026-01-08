// shared/randomId.ts
export function createRandomId(): string {
  // まず crypto が存在する場合だけ使う
  const cryptoObj = (globalThis as unknown as { crypto?: Crypto }).crypto;

  // 現代ブラウザであればこれが最優先
  if (cryptoObj && typeof cryptoObj.randomUUID === "function") {
    return cryptoObj.randomUUID();
  }

  // 典型的なフォールバック
  if (cryptoObj && typeof cryptoObj.getRandomValues === "function") {
    const bytes = new Uint32Array(4);
    cryptoObj.getRandomValues(bytes);
    return (
      bytes[0].toString(16) +
      "-" +
      bytes[1].toString(16) +
      "-" +
      bytes[2].toString(16) +
      "-" +
      bytes[3].toString(16)
    );
  }

  // 最後の保険：Math.random + 時刻
  return (
    "id-" +
    Date.now().toString(36) +
    "-" +
    Math.random().toString(36).slice(2)
  );
}
