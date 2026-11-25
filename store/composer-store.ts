"use client";

import { create } from "zustand";
import { COMPOSER_TOOLS } from "@/config/composer-tools";
import { LIMITS } from "@/config/limits";
import { DEFAULT_MODEL_ID, getModel } from "@/config/models";
import { isModelAllowed, isToolAllowed } from "@/lib/api/entitlements";
import { attachmentKind } from "@/lib/attachments";
import type { Attachment } from "@/types/chat";
import type { ComposerToolId } from "@/types/model";

// separate from the thread: the draft survives a conversation switch, the history doesn't

interface ComposerState {
  input: string;
  modelId: string;
  attachments: Attachment[];
  enabledTools: ComposerToolId[];

  setInput: (value: string) => void;
  setModel: (modelId: string) => void;
  toggleTool: (id: ComposerToolId) => void;
  addAttachments: (files: File[]) => void;
  removeAttachment: (id: string) => void;
  clear: () => void;
}

export const useComposerStore = create<ComposerState>((set, get) => ({
  input: "",
  modelId: DEFAULT_MODEL_ID,
  attachments: [],
  enabledTools: COMPOSER_TOOLS.filter((tool) => tool.defaultEnabled).map((tool) => tool.id),

  setInput(value) {
    set({ input: value });
  },

  setModel(modelId) {
    if (!isModelAllowed(modelId, LIMITS)) return;
    const capabilities = getModel(modelId).capabilities;

    // turn off tools the new model can't run instead of silently ignoring them on send
    set((state) => ({
      modelId,
      enabledTools: state.enabledTools.filter((id) => {
        const tool = COMPOSER_TOOLS.find((item) => item.id === id);
        return !tool?.requires || capabilities[tool.requires];
      }),
    }));
  },

  toggleTool(id) {
    if (!isToolAllowed(id, LIMITS)) return;
    set((state) => ({
      enabledTools: state.enabledTools.includes(id)
        ? state.enabledTools.filter((item) => item !== id)
        : [...state.enabledTools, id],
    }));
  },

  addAttachments(files) {
    const room = LIMITS.maxAttachments - get().attachments.length;
    if (room <= 0) return;

    const added = files.slice(0, room).map<Attachment>((file) => ({
      id: `att_${file.name}_${file.size}_${file.lastModified}`,
      name: file.name,
      mimeType: file.type || "application/octet-stream",
      size: file.size,
      kind: attachmentKind(file.type),
      url: URL.createObjectURL(file),
      previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
    }));

    set((state) => ({ attachments: [...state.attachments, ...added] }));
  },

  removeAttachment(id) {
    const target = get().attachments.find((item) => item.id === id);
    if (target) {
      URL.revokeObjectURL(target.url);
      if (target.previewUrl) URL.revokeObjectURL(target.previewUrl);
    }
    set((state) => ({ attachments: state.attachments.filter((item) => item.id !== id) }));
  },

  clear() {
    for (const attachment of get().attachments) {
      URL.revokeObjectURL(attachment.url);
      if (attachment.previewUrl) URL.revokeObjectURL(attachment.previewUrl);
    }
    set({ input: "", attachments: [] });
  },
}));
