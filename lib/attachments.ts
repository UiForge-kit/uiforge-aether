import type { AttachmentKind } from "@/types/chat";

export function attachmentKind(mimeType: string): AttachmentKind {
  if (mimeType.startsWith("image/")) return "image";
  if (mimeType.startsWith("audio/")) return "audio";
  if (mimeType.includes("json") || mimeType.includes("javascript")) return "code";
  return "document";
}
