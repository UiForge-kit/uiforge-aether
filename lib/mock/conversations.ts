import type { Conversation, Message } from "@/types/chat";
import { A11Y_SEED } from "./seeds/a11y";
import { MOBILE_MONEY_SEED } from "./seeds/mobile-money";
import { STREAMING_SEED } from "./seeds/streaming";
import type { Seed } from "./seeds/types";

// stands in for `GET /conversations`. the pinned thread covers every display capability, keep it as is for screenshots
const SEEDS: Seed[] = [MOBILE_MONEY_SEED, STREAMING_SEED, A11Y_SEED];

function buildMessages(seed: Seed): Message[] {
  const messages: Message[] = [];
  const start = Date.parse(seed.createdAt);
  const span = Math.max(Date.parse(seed.updatedAt) - start, 60_000);
  const stepCount = seed.turns.length * 2;

  seed.turns.forEach((turn, index) => {
    const userAt = new Date(start + (span * (index * 2)) / stepCount).toISOString();
    const assistantAt = new Date(start + (span * (index * 2 + 1)) / stepCount).toISOString();
    const input = turn.inputTokens ?? 80;
    const output = turn.outputTokens ?? 240;

    messages.push({
      id: `${seed.id}_u${index}`,
      conversationId: seed.id,
      role: "user",
      content: turn.user,
      status: "complete",
      createdAt: userAt,
      attachments: turn.userFiles,
      links: turn.userLinks,
    });

    messages.push({
      id: `${seed.id}_a${index}`,
      conversationId: seed.id,
      role: "assistant",
      content: turn.assistant,
      status: "complete",
      createdAt: assistantAt,
      modelId: seed.modelId,
      reasoning: turn.reasoning,
      links: turn.sources,
      attachments: turn.outputFiles,
      canvas: turn.canvas,
      usage: { input, output, total: input + output },
    });
  });

  return messages;
}

export function createSeedConversations(): Conversation[] {
  return SEEDS.map((seed) => {
    const lastTurn = seed.turns[seed.turns.length - 1];
    return {
      id: seed.id,
      title: seed.title,
      preview: lastTurn.assistant.replace(/[*_`#\n]/g, " ").slice(0, 120).trim(),
      createdAt: seed.createdAt,
      updatedAt: seed.updatedAt,
      modelId: seed.modelId,
      messageCount: seed.turns.length * 2,
      pinned: seed.pinned ?? false,
      archived: false,
      origin: "seed",
    } satisfies Conversation;
  });
}

export function createSeedMessages(): Record<string, Message[]> {
  return Object.fromEntries(SEEDS.map((seed) => [seed.id, buildMessages(seed)]));
}
