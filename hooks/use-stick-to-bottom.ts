"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Keeps a scroll container pinned to the bottom while content streams,
 * unless the user deliberately scrolled up to read.
 */
export function useStickToBottom<T extends HTMLElement>(dependency: unknown) {
  const ref = useRef<T>(null);
  const pinned = useRef(true);

  const onScroll = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    pinned.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !pinned.current) return;
    if (Array.isArray(dependency) && dependency.length === 0) return;
    el.scrollTop = el.scrollHeight;
  }, [dependency]);

  const pin = useCallback(() => {
    pinned.current = true;
  }, []);

  return { ref, onScroll, pin };
}
