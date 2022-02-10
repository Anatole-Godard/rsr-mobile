export type ChannelInvite = {
  token: string;
  channelSlug: string;
  expirationType: "temporary" | "uses" | "none";
  expiresAt?: Date | string;
  maxUses?: number;
};