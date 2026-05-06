import { InputFile } from "grammy/mod.ts";

export default async function getImageInputFile(imageUrl: string): Promise<InputFile | null> {
  try {
    const res = await fetch(imageUrl);

    if (res.ok === false) return null;

    const contentType = res.headers.get("content-type")?.toLowerCase() ?? "";
    if (contentType.startsWith("image/") === false) return null;

    const arrayBuffer = await res.arrayBuffer();
    if (arrayBuffer.byteLength === 0) return null;

    return new InputFile(new Uint8Array(arrayBuffer));
  } catch {
    return null;
  }
}
