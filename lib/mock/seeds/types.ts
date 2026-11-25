import type {
  Attachment,
  CanvasDocument,
  LinkPreview,
  ReasoningStep,
} from "@/types/chat";

export interface SeedTurn {
  user: string;
  assistant: string;
  reasoning?: ReasoningStep[];
  userFiles?: Attachment[];
  userLinks?: LinkPreview[];
  sources?: LinkPreview[];
  outputFiles?: Attachment[];
  canvas?: CanvasDocument[];
  inputTokens?: number;
  outputTokens?: number;
}

export interface Seed {
  id: string;
  title: string;
  modelId: string;
  updatedAt: string;
  createdAt: string;
  pinned?: boolean;
  turns: SeedTurn[];
}
