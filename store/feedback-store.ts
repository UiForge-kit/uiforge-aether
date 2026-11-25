"use client";

import { create } from "zustand";
import { readPersisted, storageKey, writePersisted } from "@/lib/storage/persisted";

// kept apart from the thread: feedback survives a demo reset and is never sent back to the model

const KEY = storageKey("feedback");

export type Vote = "up" | "down";

interface FeedbackState {
  votes: Record<string, Vote>;
  hydrated: boolean;
  hydrate: () => void;
  toggle: (messageId: string, vote: Vote) => void;
  clearVote: (messageId: string) => void;
}

export const useFeedbackStore = create<FeedbackState>((set, get) => ({
  votes: {},
  hydrated: false,

  hydrate() {
    if (get().hydrated) return;
    set({ votes: readPersisted<Record<string, Vote>>(KEY, {}), hydrated: true });
  },

  toggle(messageId, vote) {
    const votes = { ...get().votes };
    if (votes[messageId] === vote) delete votes[messageId];
    else votes[messageId] = vote;

    set({ votes });
    writePersisted(KEY, votes);
  },

  clearVote(messageId) {
    if (!(messageId in get().votes)) return;

    const votes = { ...get().votes };
    delete votes[messageId];

    set({ votes });
    writePersisted(KEY, votes);
  },
}));
