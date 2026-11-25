import type { ChatStorage } from "./adapter";
import { localChatStorage } from "./local";

// only wiring point: another `ChatStorage` implementation plugs in here
export const storage: ChatStorage = localChatStorage;

export type { ChatStorage } from "./adapter";
