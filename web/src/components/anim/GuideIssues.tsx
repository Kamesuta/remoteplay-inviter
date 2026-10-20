"use client";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useLoopAnimation, type Loop } from "./useLoopAnimation";
import { Callout, ControllerPage, Cursor, Frame, IssuesPage, Ripples, Tabs, Window, stageStyle } from "./X360Window";
import "./x360.css";
import "./GuideIssues.css";

// Step 2: open Issues when it shows a warning, press Install, wait for "All OK"
const LOOP: Loop = {
  beats: [
    [300, ['k1'], []],
    [900, ['c1'], []],
    [1600, ['p1'], []],
    [1750, ['iss'], ['p1', 'k1']],
    [2100, ['k2'], []],
    [2500, ['c2'], []],
    [3200, ['p2', 'ins'], []],
    [3350, [], ['p2']],
    [3500, ['c3'], ['c2', 'k2']],
    [4600, ['ok', 'k3'], ['ins']],
    [4900, ['ca'], ['c3']],
  ],
  period: 7600,
  finalFlags: ['iss', 'ok', 'k3'],
};

export default function GuideIssues() {
  const t = useTranslations("anim.gis");
  const x = useTranslations("anim.x360");
  const ref = useRef<HTMLDivElement>(null);
  useLoopAnimation(ref, LOOP);
  return (
    <div className="rpa xa gis" ref={ref} role="img" aria-label={t("label")} style={stageStyle}>
      <div className="sc">
        <div className="pg-c1">
          <Window>
            <Frame />
            <Tabs issues="swap" />
            <ControllerPage keyboard={x("keyboard")} device="none" enable="off" values="none" />
          </Window>
        </div>
        <div className="pg-is">
          <Window>
            <Frame />
            <Tabs issues="swap" />
            <IssuesPage description={x("driverNeeded")} />
          </Window>
        </div>
        <Callout show="k1" x={362} y={100} arrow={["up", 62]}>{t("k1")}</Callout>
        <Callout show="k2" x={550} y={182} arrow={["up", 73]}>{t("k2")}</Callout>
        <Callout show="k3" x={40} y={374} arrow={["down", 24]}>{t("k3")}</Callout>
        <Ripples count={2} />
        <Cursor />
      </div>
    </div>
  );
}
