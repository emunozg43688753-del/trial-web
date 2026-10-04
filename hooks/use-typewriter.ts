"use client";

import { useEffect, useState } from "react";

/** Cycles through phrases with a typing/erasing effect. Static when paused or reduced motion. */
export function useTypewriter(phrases: string[], { paused = false, typeMs = 38, holdMs = 2200 } = {}) {
  const [index, setIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const phrase = phrases[index % phrases.length] ?? "";

  useEffect(() => {
    if (paused || reduced) return;
    let delay = deleting ? typeMs / 2 : typeMs;
    if (!deleting && length === phrase.length) delay = holdMs;
    if (deleting && length === 0) delay = 300;

    const t = setTimeout(() => {
      if (!deleting && length === phrase.length) setDeleting(true);
      else if (deleting && length === 0) {
        setDeleting(false);
        setIndex((i) => i + 1);
      } else setLength((l) => l + (deleting ? -1 : 1));
    }, delay);
    return () => clearTimeout(t);
  }, [deleting, length, phrase, paused, reduced, typeMs, holdMs]);

  if (reduced) return phrases[0] ?? "";
  return phrase.slice(0, length);
}
