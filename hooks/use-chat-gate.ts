"use client";

import { useCallback, useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { growthConfig } from "@/config/growth";
import { getAnonChatCount, incrementAnonChatCount, track } from "@/lib/growth/client";

/**
 * Soft registration gate for TRIAL Brain: anonymous visitors get a few free
 * messages, then are invited to create an account (and win the demo).
 * Server-side rate limiting still protects the endpoint.
 */
export function useChatGate() {
  const { user, configured } = useAuth();
  const [gated, setGated] = useState(false);
  const anonymous = configured && !user;

  /** Returns true when the message may be sent. */
  const allow = useCallback((): boolean => {
    if (!anonymous) return true;
    if (getAnonChatCount() >= growthConfig.anonChatLimit) {
      setGated(true);
      track("chat_gate_shown");
      return false;
    }
    incrementAnonChatCount();
    return true;
  }, [anonymous]);

  return { allow, gated: gated && anonymous, anonymous };
}
