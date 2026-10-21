"use client";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useLoopAnimation, type Loop } from "./useLoopAnimation";
import { Callout, ControllerPage, Cursor, Frame, Ripples, Tabs, Window, stageStyle } from "./X360Window";
import "./x360.css";
import "./GuidePaste.css";

// Step 4: copy the preset on this page, Paste Preset, Save All
const LOOP: Loop = {
  beats: [
    [300, ['k1'], []],
    [800, ['c1'], []],
    [1400, ['p1', 't1'], []],
    [1550, [], ['p1']],
    [2300, ['cg'], ['k1', 't1']],
    [2600, ['c2'], ['c1']],
    [3200, ['p2'], []],
    [3350, ['fill', 'k2'], ['p2']],
    [4700, ['c3'], ['c2', 'k2']],
    [5300, ['p3', 't2'], []],
    [5450, [], ['p3']],
    [5700, ['ca'], ['c3']],
  ],
  period: 8200,
};

const KEYS = [["W", "#06dec5"], ["A", "#06dec5"], ["S", "#06dec5"], ["D", "#06dec5"], ["K", "#4cc25a"], ["L", "#f0584c"], ["J", "#3b8bff"], ["I", "#f2c230"]];

export default function GuidePaste() {
  const t = useTranslations("anim.gps");
  const x = useTranslations("anim.x360");
  const ref = useRef<HTMLDivElement>(null);
  useLoopAnimation(ref, LOOP);
  return (
    <div className="rpa xa gps" ref={ref} role="img" aria-label={t("label")} style={stageStyle}>
      <div className="sc">
        <Window>
          <Frame />
          <Tabs issues="ok" />
          <ControllerPage keyboard={x("keyboard")} device="on" enable="on" values="fill" />
        </Window>
        {/* The preset card on this page */}
        <div className="ab card" style={{ left: 22, top: 120, width: 262, padding: "16px 16px 16px 18px", borderRadius: 22, background: "#18263a", border: "1px solid #26384f", boxShadow: "0 18px 40px rgba(0,0,0,.5)", color: "#ffffff", display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 900 }}>{t("card")}</div>
            <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
              {KEYS.map(([k, c], i) => (
                <b key={k} style={{ width: 24, height: 24, marginLeft: i === 4 ? 10 : 0, borderRadius: 6, background: c, color: "#0b1520", fontSize: 12, display: "grid", placeItems: "center" }}>
                  {k}
                </b>
              ))}
            </div>
          </div>
          <div className="cpb" style={{ position: "relative", height: 44, borderRadius: 999, background: "#a4d007", color: "#16210a", fontSize: 15, fontWeight: 900, boxShadow: "0 4px 0 #6f8d05", transition: "transform .12s var(--eo)" }}>
            <span className="l0">{t("copy")}</span>
            <span className="l1">{t("copied")}</span>
          </div>
        </div>
        <Callout show="k1" x={22} y={72} arrow={["down", 40]}>{t("k1")}</Callout>
        <Callout show="k2" x={404} y={378} arrow={["down", 197]}>{t("k2")}</Callout>
        <Callout show="t2" x={520} y={102} arrow={["up", 105]}>{t("k3")}</Callout>
        <Ripples count={3} />
        <Cursor />
      </div>
    </div>
  );
}
