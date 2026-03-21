export type VerificationState = "unknown" | "verified" | "pending" | "failed";

export const worldConfig = {
  appId: process.env.NEXT_PUBLIC_WORLD_APP_ID || "",
  action: process.env.NEXT_PUBLIC_WORLD_ACTION || "claim-task",
  environment: process.env.NEXT_PUBLIC_WORLD_ENV || "staging",
};
