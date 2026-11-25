export type SendBehavior = "enter" | "mod-enter";
export type FontScale = "compact" | "normal" | "large";
export type FontFamily = "auto" | "sans" | "display" | "serif" | "mono";

export interface Preferences {
  sendBehavior: SendBehavior;
  fontScale: FontScale;
  fontFamily: FontFamily;
  showReasoning: boolean;
  saveHistory: boolean;
  shareTelemetry: boolean;
  /** Stored but not applied, the template isn't translated. */
  language: string;

  twoFactor: boolean;

  notifyReplies: boolean;
  notifyMentions: boolean;
  notifyDigest: boolean;
  notifyProduct: boolean;
  notifySound: boolean;

  voiceId: string;
  voiceLocale: string;
  voiceAutoSend: boolean;
}

export const DEFAULT_PREFERENCES: Preferences = {
  sendBehavior: "enter",
  fontScale: "normal",
  fontFamily: "auto",
  showReasoning: false,
  saveHistory: true,
  shareTelemetry: false,
  language: "fr-FR",

  twoFactor: false,

  notifyReplies: true,
  notifyMentions: true,
  notifyDigest: false,
  notifyProduct: false,
  notifySound: true,

  voiceId: "aria",
  voiceLocale: "fr-FR",
  voiceAutoSend: true,
};
