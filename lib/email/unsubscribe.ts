import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { siteConfig } from "@/config/site";

const secret = () => process.env.EMAIL_SIGNING_SECRET ?? process.env.CRON_SECRET ?? "";

export function unsubscribeToken(uid: string): string {
  return createHmac("sha256", secret()).update(uid).digest("hex").slice(0, 32);
}

export function verifyUnsubscribe(uid: string, token: string): boolean {
  if (!secret() || !uid || !token) return false;
  const expected = Buffer.from(unsubscribeToken(uid));
  const given = Buffer.from(token);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

export function unsubscribeUrl(uid: string): string {
  return `${siteConfig.url}/api/unsubscribe?u=${encodeURIComponent(uid)}&t=${unsubscribeToken(uid)}`;
}
