import { minutesAgo } from "@/lib/date";
import { MARKET_TURNS } from "./mobile-money-market";
import { CHARGE_TURNS } from "./mobile-money-charge";
import { WEBHOOK_TURNS } from "./mobile-money-webhook";
import { WRAP_UP_TURNS } from "./mobile-money-wrap-up";
import type { Seed } from "./types";

export const MOBILE_MONEY_SEED: Seed = {
  id: "conv_mobile_money",
  title: "Encaissement mobile money en Afrique centrale",
  modelId: "claude-opus-4-6",
  createdAt: minutesAgo(310),
  updatedAt: minutesAgo(8),
  pinned: true,
  turns: [
    ...MARKET_TURNS,
    ...CHARGE_TURNS,
    ...WEBHOOK_TURNS,
    ...WRAP_UP_TURNS,
  ],
};
