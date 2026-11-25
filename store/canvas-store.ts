"use client";

import { create } from "zustand";
import type { CanvasDocument } from "@/types/chat";

// `document` is never cleared on close: the window animates out and would lose its content mid-animation
interface CanvasState {
  document: CanvasDocument | null;
  open: boolean;
  show: (document: CanvasDocument) => void;
  setOpen: (open: boolean) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  document: null,
  open: false,
  show: (document) => set({ document, open: true }),
  setOpen: (open) => set({ open }),
}));
