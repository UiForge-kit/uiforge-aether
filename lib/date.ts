import type { Conversation, ConversationGroup, DateBucket } from "@/types/chat";

const BUCKET_LABELS: Record<DateBucket, string> = {
  today: "Aujourd'hui",
  yesterday: "Hier",
  last7: "7 derniers jours",
  last30: "30 derniers jours",
  older: "Plus ancien",
};

const BUCKET_ORDER: DateBucket[] = ["today", "yesterday", "last7", "last30", "older"];

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

export function bucketFor(iso: string, now = new Date()): DateBucket {
  const days = Math.floor((startOfDay(now) - startOfDay(new Date(iso))) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  if (days <= 7) return "last7";
  if (days <= 30) return "last30";
  return "older";
}

export function groupConversations(
  conversations: Conversation[],
  now = new Date(),
): ConversationGroup[] {
  const sorted = [...conversations].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
  });

  const pinned = sorted.filter((item) => item.pinned);
  const rest = sorted.filter((item) => !item.pinned);

  const buckets = new Map<DateBucket, Conversation[]>();
  for (const conversation of rest) {
    const bucket = bucketFor(conversation.updatedAt, now);
    const existing = buckets.get(bucket);
    if (existing) existing.push(conversation);
    else buckets.set(bucket, [conversation]);
  }

  const groups: ConversationGroup[] = [];
  if (pinned.length > 0) {
    groups.push({ bucket: "today", label: "Épinglées", items: pinned });
  }
  for (const bucket of BUCKET_ORDER) {
    const items = buckets.get(bucket);
    if (items?.length) groups.push({ bucket, label: BUCKET_LABELS[bucket], items });
  }
  return groups;
}

export function formatRelative(iso: string, now = new Date()): string {
  const diff = now.getTime() - Date.parse(iso);
  const minutes = Math.round(diff / 60_000);
  if (minutes < 1) return "à l'instant";
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.round(hours / 24);
  if (days < 7) return `il y a ${days} j`;
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" }).format(
    new Date(iso),
  );
}

export function formatTime(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatDay(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short" }).format(
    new Date(iso),
  );
}

export function daysAgo(days: number, hour = 10, minute = 0): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hour, minute, 0, 0);
  return date.toISOString();
}

export function minutesAgo(minutes: number): string {
  return new Date(Date.now() - minutes * 60_000).toISOString();
}
