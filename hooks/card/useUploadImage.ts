// hooks/card/useUploadImage.ts

export type UploadImageAsset = {
  id: string;
  tmpPath: string;
  signedUrl: string;
  mime: string;
  originalName?: string;
  size?: number;
};

export async function uploadImage(
  code: string,
  file: File,
): Promise<UploadImageAsset> {
  const form = new FormData();
  form.append("code", code);
  form.append("file", file);

  const res = await fetch("/api/uploads/images", {
    method: "POST",
    body: form,
  });

  const json = await res.json();

  if (!res.ok || !json?.ok) {
    throw new Error(json?.error || `upload_failed (${res.status})`);
  }

  return json.asset as UploadImageAsset;
}
