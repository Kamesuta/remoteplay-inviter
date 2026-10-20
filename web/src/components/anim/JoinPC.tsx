"use client";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useLoopAnimation, type Loop } from "./useLoopAnimation";
import "./JoinPC.css";

const LOOP: Loop = {
  beats: [
    [200, ['s1', 'ct1'], []],
    [800, ['ct2'], []],
    [1500, ['s2', 'm1'], ['s1']],
    [2200, ['k1'], []],
    [2400, [], ['k1']],
    [2500, ['b1'], []],
    [2800, ['s3', 'm2'], ['s2']],
    [3400, ['k2'], []],
    [3600, [], ['k2']],
    [3700, ['cl'], ['m2']],
    [4800, ['d1'], []],
    [5200, ['d2'], []],
  ],
  period: 7200,
  finalFlags: ['ct1', 'ct2', 'b1', 'cl', 'd1', 'd2', 's3'],
};

export default function JoinPC() {
  const t = useTranslations("anim.jpc");
  const ref = useRef<HTMLDivElement>(null);
  useLoopAnimation(ref, LOOP);
  return (
    <div className="rpa jpc" ref={ref} role="img" aria-label={t("attr1")} style={{ position: "relative", width: "640px", height: "400px", background: "#111d2c", overflow: "hidden", color: "#ffffff", fontFamily: "var(--font-zen), sans-serif" }}>
      <div className="sc">
        <div className="mon"></div>
        <div className="neck"></div>
        <div className="foot"></div>
        <div className="scr">
          <div className="ly la">
            <div className="side">
              <i></i>
              <i></i>
              <i></i>
            </div>
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
            </div>
          </div>
          <div className="ly lb">
            <div className="tab"><span>Steam Remote Play</span></div>
            <div className="url"><span>s.team/remoteplay/connect/…</span></div>
            <span className="sh">STEAM</span>
            <span className="bn">POCO PARK 2</span>
            <p>{t.rich("p1", { b0: (c) => <b>{c}</b> })}</p>
            <span className="jb">{t("t4")}</span>
            <small>{t("t5")}</small>
          </div>
          <div className="ly lc">
            <span className="ring"><i></i></span>
            <b>Steam Link</b>
            <small>{t("t6")}</small>
            <span className="pg"><i></i></span>
          </div>
          <div className="ly gm">
            <span className="tt">POCO PARK 2</span>
            <span className="pf" style={{ left: "150px", bottom: "84px", width: "80px" }}></span>
            <span className="pf" style={{ left: "250px", bottom: "116px", width: "60px" }}></span>
            <span className="pl" style={{ left: "110px", background: "#e58a3a" }}></span>
            <span className="pl" style={{ left: "138px", background: "#06dec5" }}></span>
            <span className="pl" style={{ left: "166px", background: "#fe4d95", animationDelay: ".3s" }}></span>
            <span className="pl" style={{ left: "194px", background: "#dcc02e", animationDelay: ".45s" }}></span>
            <span className="gr"></span>
          </div>
        </div>
        <div className="bd">{t("t7")}</div>
        <span className="rg r1"></span>
        <span className="rg r2"></span>
        <svg className="cur" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 2l16 9.5-7 1.6L9.6 20z" fill="#ffffff" stroke="#111d2c" strokeWidth="1.5" strokeLinejoin="round"></path>
        </svg>
        <svg className="pad" viewBox="0 -30 200 170" fill="none" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M40 50 C40 36 54 31 70 33 L130 33 C146 31 160 36 160 50 L172 100 C176 121 150 128 138 108 L128 92 L72 92 L62 108 C50 128 24 121 28 100 Z"></path>
          <path d="M62 56 v22 M51 67 h22"></path>
          <circle cx="132" cy="60" r="5"></circle>
          <circle cx="146" cy="73" r="5"></circle>
          <path d="M100 33 V8"></path>
          <circle cx="100" cy="4" r="4"></circle>
          <path d="M90 -6 A14 14 0 0 1 110 -6"></path>
        </svg>
        <div className="ok">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>
          {t("t8")}
        </div>
        <div className="steps">
          <span className="chip">{t("t9")}</span>
          <div className="st st1">{t.rich("div2", { b0: (c) => <b>{c}</b> })}</div>
          <div className="st st2">{t.rich("div3", { b0: (c) => <b>{c}</b> })}</div>
          <div className="st st3">{t.rich("div4", { b0: (c) => <b>{c}</b> })}</div>
        </div>
      </div>
    </div>
  );
}
