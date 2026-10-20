"use client";
import { useEffect, useRef, useState, type CSSProperties } from "react";

interface Labels {
  idle: string;
  copied: string;
  // Shown when the clipboard is blocked and the code was selected instead
  selected: string;
}

// Copies a preset. If the clipboard can't be used, it opens and selects the
// code block with the id `target` so the viewer can copy it by hand.
export default function CopyButton({ text, target, labels, style }: { text: string; target: string; labels: Labels; style?: CSSProperties }) {
  const [state, setState] = useState<"idle" | "copied" | "selected">("idle");
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const show = (next: "copied" | "selected") => {
    setState(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("idle"), 2500);
  };
  const fallback = () => {
    const el = document.getElementById(target);
    if (el) {
      el.closest("details")?.setAttribute("open", "");
      window.getSelection()?.selectAllChildren(el);
    }
    let ok = false;
    try {
      ok = document.execCommand("copy");
    } catch {
      ok = false;
    }
    show(ok ? "copied" : "selected");
  };
  const copy = () => {
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(() => show("copied"), fallback);
    else fallback();
  };

  return (
    <button className="pill" type="button" style={style} onClick={copy}>
      {labels[state]}
    </button>
  );
}
