"use client";

import { avatarUri } from "@/lib/avatars";
import { MOCK_USER } from "@/lib/mock/user";
import { cn } from "@/lib/utils";
import { useProfileStore } from "@/store/profile-store";

export function UserAvatar({ className }: { className?: string }) {
  const avatarId = useProfileStore((state) => state.avatarId);
  const uri = avatarUri(avatarId);

  return (
    <span
      className={cn(
        "grid size-8 shrink-0 place-items-center overflow-hidden rounded-lg text-xs font-semibold",
        // illustrations come without a background, it is picked here
        uri ? "bg-muted" : "bg-brand text-brand-foreground",
        className,
      )}
    >
      {uri ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={uri} alt="" className="size-full object-cover" />
      ) : (
        MOCK_USER.initials
      )}
    </span>
  );
}
