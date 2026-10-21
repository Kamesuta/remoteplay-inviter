"use client";
import { useRef, type CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { useLoopAnimation, type Loop } from "./useLoopAnimation";
import "./Setup.css";

const LOOP: Loop = {
  beats: [
    [1000, ['s1'], []],
    [1500, ['s2'], []],
    [2300, ['s3'], []],
    [2900, ['k1', 's4'], []],
    [3600, ['k2'], ['k1']],
    [3950, ['s5', 's6'], []],
    [4600, [], ['k2']],
  ],
  period: 7200,
};

export default function Setup() {
  const t = useTranslations("anim.stp");
  const ref = useRef<HTMLDivElement>(null);
  useLoopAnimation(ref, LOOP);
  return (
    <div className="rpa stp" ref={ref} role="img" aria-label={t("attr1")} style={{ position: "relative", width: "640px", height: "460px", background: "#111d2c", borderRadius: "20px", overflow: "hidden", color: "#ffffff" }}>
      <div className="sc">
        <div className="cw">
          <div className="tb">
            <i style={{ background: "#fe4d95" }}></i>
            <i style={{ background: "#dcc02e" }}></i>
            <i style={{ background: "#06dec5" }}></i>
            <span>Remote Play Inviter</span>
          </div>
          <div className="cb">
            <div className="ln">
              <span className="wait">
                <i className="spin"></i>
                {t("t1")}
              </span>
              <span className="ok">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>
                {t("t2")}
              </span>
            </div>
            <div className="cp">
              <p>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="8" y="3" width="8" height="4" rx="1"></rect>
                  <path d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"></path>
                </svg>
                {t("t3")}
              </p>
              <div className="code">/steam setup client_id:7f3a9c…</div>
            </div>
          </div>
        </div>
        <div className="kc">
          <span className="k-paste">
            <b>Ctrl</b>
            <b>V</b>
          </span>
          <span className="k-enter"><b>Enter</b></span>
        </div>
        <div className="dw">
          <div className="dh">{t.rich("div1", { em0: (c) => <em>{c}</em> })}</div>
          <div className="rp">
            <span className="ba"></span>
            <div style={{ flex: "1", minWidth: "0" }}>
              <div className="rn">Remote Play Inviter</div>
              <div className="rc">
                <span className="ck">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#16210a" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>
                </span>
                <span className="cf">
                  <i style={{ "--dx": "-40px", "--dy": "-34px", "--r": "120deg", background: "#06dec5" } as CSSProperties}></i>
                  <i style={{ "--dx": "-8px", "--dy": "-46px", "--r": "-90deg", background: "#fe4d95" } as CSSProperties}></i>
                  <i style={{ "--dx": "26px", "--dy": "-38px", "--r": "200deg", background: "#dcc02e" } as CSSProperties}></i>
                  <i style={{ "--dx": "44px", "--dy": "-8px", "--r": "80deg", background: "#1a9fff" } as CSSProperties}></i>
                  <i style={{ "--dx": "-46px", "--dy": "4px", "--r": "-160deg", background: "#a4d007" } as CSSProperties}></i>
                  <i style={{ "--dx": "30px", "--dy": "22px", "--r": "140deg", background: "#fe4d95" } as CSSProperties}></i>
                  <i style={{ "--dx": "-26px", "--dy": "26px", "--r": "60deg", background: "#dcc02e" } as CSSProperties}></i>
                  <i style={{ "--dx": "6px", "--dy": "34px", "--r": "-40deg", background: "#06dec5" } as CSSProperties}></i>
                </span>
                <strong>{t("t4")}</strong>
                {t("t5")}{" "}
                <code>/steam invite</code>
                {" "}{t("t6")}
              </div>
            </div>
          </div>
          <div className="in">
            <span className="hint">{t("t7")}</span>
            <span className="typed">/steam setup client_id:7f3a9c…</span>
          </div>
        </div>
      </div>
    </div>
  );
}
