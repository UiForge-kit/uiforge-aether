export type SocialId = "linkedin" | "github" | "x" | "website";

export interface Profile {
  nickname: string;
  bio: string;
  phone: string;
  avatarId: string;
  socials: Record<SocialId, string>;
}

export const DEFAULT_PROFILE: Profile = {
  nickname: "",
  bio: "",
  phone: "",
  avatarId: "micah:Ibrahim",
  socials: { linkedin: "", github: "", x: "", website: "" },
};
