"use client";

import type { Attribution } from "@/lib/account/types";

/* ───────────── First-touch attribution ───────────── */

const ATTR_KEY = "trial.attribution.v1";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;

/** Stores where the visitor came from on their first visit, so every signup has a source. */
export function captureAttribution() {
  try {
    if (window.localStorage.getItem(ATTR_KEY)) return;
    const params = new URLSearchParams(window.location.search);
    const data: Attribution = {
      landing: window.location.pathname,
      referrer: document.referrer && !document.referrer.includes(window.location.host) ? document.referrer : "",
    };
    for (const k of UTM_KEYS) {
      const v = params.get(k);
      if (v) data[k] = v;
    }
    window.localStorage.setItem(ATTR_KEY, JSON.stringify(data));
  } catch {
    /* storage unavailable */
  }
}

export function getAttribution(): Attribution {
  try {
    return JSON.parse(window.localStorage.getItem(ATTR_KEY) ?? "{}") as Attribution;
  } catch {
    return {};
  }
}

/* ───────────── Analytics ───────────── */

type DataLayerWindow = Window & { dataLayer?: Record<string, unknown>[] };

/**
 * Conversion events pushed to `window.dataLayer` — ready for Google Tag Manager,
 * GA4 or Meta Pixel without changing call sites.
 */
export function track(event: string, props: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as DataLayerWindow;
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push({ event, ...props });
}

/* ───────────── Anonymous chat allowance ───────────── */

const CHAT_KEY = "trial.anonChat.v1";

export function getAnonChatCount(): number {
  try {
    return Number(window.localStorage.getItem(CHAT_KEY) ?? 0) || 0;
  } catch {
    return 0;
  }
}

export function incrementAnonChatCount(): number {
  const next = getAnonChatCount() + 1;
  try {
    window.localStorage.setItem(CHAT_KEY, String(next));
  } catch {
    /* ignore */
  }
  return next;
}
