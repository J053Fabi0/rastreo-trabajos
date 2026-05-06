import { DOMParser } from "@b-fuze/deno-dom";

export default function decodeHtml(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc?.body?.textContent ?? "";
}
