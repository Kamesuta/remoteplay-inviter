"use client";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useLoopAnimation, type Loop } from "./useLoopAnimation";
import { Callout, ControllerPage, Cursor, Frame, Ripples, Tabs, Window, stageStyle } from "./X360Window";
import "./x360.css";
import "./GuideCheck.css";

// Step 5: tick Enable and Steam reports a new Xbox 360 controller
const LOOP: Loop = {
  beats: [
    [300, ['k1'], []],
    [900, ['c1'], []],
    [1600, ['p1', 'on'], []],
    [1750, [], ['p1']],
    [2000, ['ca'], ['c1']],
    [2300, ['st'], []],
    [2700, ['k2'], ['k1']],
  ],
  period: 6800,
};

export default function GuideCheck() {
  const t = useTranslations("anim.gck");
  const x = useTranslations("anim.x360");
  const ref = useRef<HTMLDivElement>(null);
  useLoopAnimation(ref, LOOP);
  return (
    <div className="rpa xa gck" ref={ref} role="img" aria-label={t("label")} style={stageStyle}>
      <div className="sc">
        <Window>
          <Frame />
          <Tabs issues="ok" />
          <ControllerPage keyboard={x("keyboard")} device="on" enable="toggle" values="on" />
        </Window>
        <Callout show="k1" x={26} y={146} arrow={["up", 16]}>{t("k1")}</Callout>
        {/* Steam's notification */}
        <div className="ab en x-st" style={{ left: 404, top: 386, width: 292, height: 62, borderRadius: 4, background: "linear-gradient(90deg, #1d2a3a, #16202c)", boxShadow: "0 12px 30px rgba(0,0,0,.5)", display: "flex", alignItems: "center", gap: 14, padding: "0 16px" }}>
          <svg width="34" height="26" viewBox="0 0 48 36" aria-hidden="true">
            <path d="M10 10 C10 6 14 5 18 6 L30 6 C34 5 38 6 38 10 L44 26 C46 33 38 35 34 29 L31 24 L17 24 L14 29 C10 35 2 33 4 26 Z" fill="#8f98a0" />
            <circle cx="16" cy="14" r="3.5" fill="#1d2a3a" />
            <circle cx="33" cy="12" r="2" fill="#1d2a3a" />
            <circle cx="36" cy="16" r="2" fill="#1d2a3a" />
          </svg>
          <div>
            <div style={{ fontSize: 11, color: "#8f98a0" }}>{t("toastTitle")}</div>
            <div style={{ fontSize: 13.5, fontWeight: 700, color: "#ffffff" }}>{t("toastName")}</div>
          </div>
        </div>
        <Callout show="k2" x={404} y={340} arrow={["down", 140]}>{t("k2")}</Callout>
        <Ripples count={1} />
        <Cursor />
      </div>
    </div>
  );
}
