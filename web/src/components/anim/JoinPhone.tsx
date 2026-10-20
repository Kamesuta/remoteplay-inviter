"use client";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useLoopAnimation, type Loop } from "./useLoopAnimation";
import "./JoinPhone.css";

const LOOP: Loop = {
  beats: [
    [200, ['s1'], []],
    [1000, ['k1'], []],
    [1200, [], ['k1']],
    [1350, ['b1', 's2'], ['s1']],
    [2300, ['k2'], []],
    [2500, [], ['k2']],
    [2650, ['c1'], []],
    [3750, ['p3', 's3'], ['s2']],
    [4350, ['d1'], []],
    [4750, ['d2'], []],
    [5050, ['d3'], []],
  ],
  period: 7200,
  finalFlags: ['b1', 'c1', 'p3', 'd1', 'd2', 'd3', 's3'],
};

export default function JoinPhone() {
  const t = useTranslations("anim.jph");
  const ref = useRef<HTMLDivElement>(null);
  useLoopAnimation(ref, LOOP);
  return (
    <div className="rpa jph" ref={ref} role="img" aria-label={t("attr1")} style={{ position: "relative", width: "640px", height: "400px", background: "#111d2c", overflow: "hidden", color: "#ffffff", fontFamily: "var(--font-zen), sans-serif" }}>
      <div className="sc">
        <div className="ph">
          <div className="scr">
            <div className="ly la">
              <div className="dh">{t.rich("div1", { em0: (c) => <em>{c}</em> })}</div>
              <div className="ep">
                <small>{t("t1")}</small>
                <strong>{t("t2")}</strong>
                <div className="gb">
                  {t("t3")}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"></path>
                  </svg>
                </div>
                <code>https://s.team/remoteplay/connect/…</code>
              </div>
            </div>
            <div className="ly lb">
              <div className="url"><span>s.team/remoteplay/connect/…</span></div>
              <div className="sh">STEAM</div>
              <div className="bn">POCO PARK 2</div>
              <p>{t.rich("p1", { b0: (c) => <b>{c}</b> })}</p>
              <div className="jb">{t("t4")}</div>
              <small>{t("t5")}</small>
            </div>
            <div className="ly lc">
              <span className="ring"><i></i></span>
              <b>Steam Link</b>
              <small>{t("t6")}</small>
              <span className="pg"><i></i></span>
            </div>
            <div className="gm">
              <span className="tt">POCO PARK 2</span>
              <span className="pf" style={{ left: "130px", bottom: "70px", width: "76px" }}></span>
              <span className="pf" style={{ left: "236px", bottom: "98px", width: "60px" }}></span>
              <span className="pl" style={{ left: "100px", background: "#e58a3a" }}></span>
              <span className="pl" style={{ left: "128px", background: "#06dec5", animationDelay: ".15s" }}></span>
              <span className="pl" style={{ left: "156px", background: "#fe4d95", animationDelay: ".3s" }}></span>
              <span className="pl" style={{ left: "184px", background: "#dcc02e", animationDelay: ".45s" }}></span>
              <span className="gr"></span>
              <div className="pad">
                <div className="dp">
                  <i style={{ left: "16px", top: "0", width: "16px", height: "48px" }}></i>
                  <i style={{ left: "0", top: "16px", width: "48px", height: "16px" }}></i>
                </div>
                <div className="ab">
                  <i></i>
                  <i></i>
                </div>
              </div>
            </div>
            <span className="tp tp1"></span>
            <span className="tp tp2"></span>
          </div>
        </div>
        <div className="bd">{t("t7")}</div>
        <div className="steps">
          <span className="chip">{t("t8")}</span>
          <div className="st st1">{t.rich("div2", { b0: (c) => <b>{c}</b> })}</div>
          <div className="st st2">{t.rich("div3", { b0: (c) => <b>{c}</b> })}</div>
          <div className="st st3">{t.rich("div4", { b0: (c) => <b>{c}</b> })}</div>
        </div>
      </div>
    </div>
  );
}
