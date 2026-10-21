"use client";
import { useEffect, type RefObject } from "react";

// [ms from the start of a round, classes to add, classes to remove]
export type Beat = readonly [number, readonly string[], readonly string[]];

export interface Loop {
  beats: readonly Beat[];
  // Length of one round; the scene then fades out, resets and starts again
  period: number;
}

// Plays an animation by toggling classes on its root element. The CSS does all
// the motion, and React never re-renders for a beat, so many animations on one
// page stay smooth. The loop only runs while the element is on screen.
// It plays even when the OS asks for reduced motion: the animations explain how
// to use the bot, and some PCs turn animation effects off for speed.
export function useLoopAnimation(ref: RefObject<HTMLElement | null>, { beats, period }: Loop) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const base = el.className;
    let flags = new Set<string>();
    let timers: ReturnType<typeof setTimeout>[] = [];
    const put = () => {
      el.className = flags.size ? `${base} ${[...flags].join(" ")}` : base;
    };

    const at = (ms: number, fn: () => void) => timers.push(setTimeout(fn, ms));
    const cycle = (offset: number) => {
      timers = [];
      at(offset, () => {
        flags.delete("fading");
        put();
      });
      for (const [ms, add, remove] of beats) {
        at(ms + offset, () => {
          add.forEach((c) => flags.add(c));
          remove.forEach((c) => flags.delete(c));
          put();
        });
      }
      at(period + offset, () => {
        flags.add("fading");
        put();
      });
      // Reset while faded out, then fade back in
      at(period + offset + 500, () => {
        flags = new Set(["fading"]);
        put();
        cycle(750);
      });
    };
    const stop = () => {
      timers.forEach((t) => clearTimeout(t));
      timers = [];
    };
    const start = () => {
      stop();
      flags = new Set();
      put();
      cycle(0);
    };

    const io = new IntersectionObserver((entries) => (entries[0].isIntersecting ? start() : stop()));
    io.observe(el);
    return () => {
      io.disconnect();
      stop();
      el.className = base;
    };
  }, [ref, beats, period]);
}
