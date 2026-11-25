export interface Limits {
  /** Files attached to one message. */
  maxAttachments: number;
  /** Messages sent to the model as context. */
  maxContextMessages: number;
  /** Conversations kept on the device. */
  maxConversations: number;
  /** Model ids the user may select, or "all". */
  allowedModelIds: readonly string[] | "all";
  /** Composer tool ids the user may enable, or "all". */
  allowedToolIds: readonly string[] | "all";
}
