export type Role = "user" | "assistant" | "system";

export type MessageStatus =
  | "pending"
  | "streaming"
  | "complete"
  | "stopped"
  | "error";

export type AttachmentKind = "image" | "document" | "audio" | "code";

export interface Attachment {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  kind: AttachmentKind;
  url: string;
  previewUrl?: string;
}

export interface ReasoningStep {
  id: string;
  kind: "thinking" | "search" | "tool" | "fetch";
  label: string;
  detail?: string;
  durationMs?: number;
  status: "running" | "done" | "error";
}

export interface LinkPreview {
  id: string;
  url: string;
  title: string;
  description?: string;
  siteName: string;
  publishedAt?: string;
}

export interface TokenUsage {
  input: number;
  output: number;
  cached?: number;
  total: number;
}

export type CanvasKind = "code" | "markdown";

export interface CanvasDocument {
  id: string;
  title: string;
  kind: CanvasKind;
  language: string;
  content: string;
}

export interface Message {
  id: string;
  conversationId: string;
  role: Role;
  content: string;
  status: MessageStatus;
  createdAt: string;
  modelId?: string;
  attachments?: Attachment[];
  links?: LinkPreview[];
  reasoning?: ReasoningStep[];
  canvas?: CanvasDocument[];
  usage?: TokenUsage;
  error?: { code: string; message: string };
  parentId?: string | null;
}

export interface Conversation {
  id: string;
  title: string;
  preview: string;
  createdAt: string;
  updatedAt: string;
  modelId: string;
  messageCount: number;
  pinned: boolean;
  archived: boolean;
  /** `seed` for conversations shipped with the template. */
  origin: "seed" | "local";
}

export type DateBucket = "today" | "yesterday" | "last7" | "last30" | "older";

export interface ConversationGroup {
  bucket: DateBucket;
  label: string;
  items: Conversation[];
}
