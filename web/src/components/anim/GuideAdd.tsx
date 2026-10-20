"use client";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useLoopAnimation, type Loop } from "./useLoopAnimation";
import { Callout, ControllerPage, Cursor, Frame, MapDeviceDialog, Ripples, Tabs, Window, stageStyle } from "./X360Window";
import "./x360.css";
import "./GuideAdd.css";

// Step 3: Add..., pick the keyboard in the dialog, Add Selected Device
const LOOP: Loop = {
  beats: [
    [300, ['k1'], []],
    [900, ['c1'], []],
    [1600, ['p1'], []],
    [1750, ['dl'], ['p1', 'k1']],
    [2100, ['k2'], []],
    [2400, ['c2'], []],
    [3000, ['p2', 'sel'], []],
    [3150, [], ['p2']],
    [3400, ['c3'], ['c2']],
    [4000, ['p3'], []],
    [4150, ['row'], ['p3', 'dl', 'sel', 'k2']],
    [4400, ['k3'], []],
    [4600, ['ca'], ['c3']],
  ],
  period: 7400,
  finalFlags: ['row', 'k3'],
};

export default function GuideAdd() {
  const t = useTranslations("anim.gad");
  const x = useTranslations("anim.x360");
  const ref = useRef<HTMLDivElement>(null);
  useLoopAnimation(ref, LOOP);
  return (
    <div className="rpa xa gad" ref={ref} role="img" aria-label={t("label")} style={stageStyle}>
      <div className="sc">
        <Window>
          <Frame />
          <Tabs issues="ok" />
          <ControllerPage keyboard={x("keyboard")} device="row" enable="off" values="none" />
        </Window>
        <div className="dlgw">
          <Window>
            <MapDeviceDialog keyboard={x("keyboard")} mouse={x("mouse")} />
          </Window>
        </div>
        <Callout show="k1" x={480} y={142} arrow={["up", 76]}>{t("k1")}</Callout>
        <Callout show="k2" x={196} y={342} light>{t("k2")}</Callout>
        <Callout show="k3" x={360} y={212} arrow={["up", 30]}>{t("k3")}</Callout>
        <Ripples count={3} />
        <Cursor />
      </div>
    </div>
  );
}
