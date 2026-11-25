import type { PlanId } from "./plan";

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  initials: string;
  plan: PlanId;
  organization?: string;
}
