"use client";

import { createPersistedSlice } from "@/store/persisted-slice";
import { DEFAULT_PROFILE } from "@/types/profile";

export const useProfileStore = createPersistedSlice("profile", DEFAULT_PROFILE);
