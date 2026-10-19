"use client";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useLoopAnimation, type Loop } from "./useLoopAnimation";
import "./Worry.css";

const LOOP: Loop = {
  beats: [
    [200, ['n1'], []],
    [700, ['st1', 'k1'], []],
    [1150, ['o1'], ['n1']],
    [1500, [], ['k1']],
    [1600, ['st2', 'c1'], ['st1']],
    [2200, ['p1'], []],
    [2350, [], ['p1']],
    [2450, ['lk'], []],
    [2900, ['c2'], ['c1']],
    [3500, ['p2', 'cp'], []],
    [3650, [], ['p2']],
    [4100, ['st3', 'k2', 'ca'], ['st2', 'c2']],
    [4500, ['d1'], []],
    [5000, ['k3', 'ps'], ['k2']],
    [5600, ['k4'], ['k3']],
    [5800, ['m1', 'cnt1'], ['ps']],
    [6200, [], ['k4']],
    [6500, ['st4', 'a2'], ['st3']],
    // Second person: the same chore again, a little faster
    [7000, ['k2'], ['d1', 'lk', 'cp', 'ca']],
    [7300, ['c1', 'r2'], ['k2']],
    [7650, ['p1'], []],
    [7780, [], ['p1']],
    [7850, ['lk'], []],
    [8100, ['c2'], ['c1']],
    [8400, ['p2', 'cp'], []],
    [8530, [], ['p2']],
    [8700, ['k2', 'ca', 'd1'], ['c2']],
    [9000, ['k3', 'ps'], ['k2']],
    [9300, ['k4'], ['k3']],
    [9450, ['m2', 'cnt2'], ['ps']],
    [9700, [], ['k4']],
    [9900, ['st5', 'a3'], ['st4']],
    [10400, ['stamp'], []],
  ],
  period: 13000,
  finalFlags: ['o1', 'lk', 'cp', 'd1', 'm1', 'm2', 'a2', 'a3', 'cnt1', 'cnt2', 'r2', 'stamp', 'st5'],
};

export default function Worry() {
  const t = useTranslations("anim.wry");
  const ref = useRef<HTMLDivElement>(null);
  useLoopAnimation(ref, LOOP);
  return (
    <div className="rpa wry" ref={ref} role="img" aria-label={t("attr1")} style={{ position: "relative", width: "880px", height: "480px", background: "#111d2c", borderRadius: "20px", overflow: "hidden", color: "#ffffff" }}>
      <div className="sc">
        <div className="gw">
          <span className="gt">POCO PARK 2</span>
          <span className="gp" style={{ left: "320px", bottom: "140px", width: "140px" }}></span>
          <span className="gp" style={{ left: "540px", bottom: "210px", width: "110px" }}></span>
          <span className="hn">{t("t1")}</span>
          <span className="hp"></span>
          <span className="gh" style={{ left: "236px" }}></span>
          <span className="gh" style={{ left: "284px" }}></span>
          <span className="gh" style={{ left: "332px" }}></span>
          <span className="gg"></span>
          <div className="dim"></div>
        </div>
        <div className="nt en x-n1">
          <span className="av" style={{ background: "#06dec5" }}></span>
          <div>
            <small>{t("t2")}</small>
            <b>{t("t3")}</b>
          </div>
        </div>
        <div className="ov en x-ov">
          <div className="ovh">{t.rich("div1", { span0: (c) => <span>{c}</span> })}</div>
          <div className="inv">INVITE ANYONE TO PLAY</div>
          <div className="lkb en x-lk">
            {t("t4")}
            <div className="lr">
              <span className="lt">
                <span className="u1">https://s.team/remoteplay/QvR7Tk2</span>
                <span className="u2">https://s.team/remoteplay/Lm4Xa9P</span>
              </span>
              <span className="cpb">{t("t5")}</span>
            </div>
          </div>
          <div className="fl">
            <div>
              <i></i>
              <u style={{ width: "90px" }}></u>
            </div>
            <div>
              <i></i>
              <u style={{ width: "120px" }}></u>
            </div>
            <div>
              <i></i>
              <u style={{ width: "70px" }}></u>
            </div>
          </div>
          <div className="ct en x-cp">{t("t6")}</div>
        </div>
        <div className="dw en x-dw">
          <div className="dh">
            <em>#</em>
            {t("t7")}
            <span className="cnt">
              {t("t8")}
              <b>
                <i className="c0">0</i>
                <i className="c1">1</i>
                <i className="c2">2</i>
              </b>
            </span>
          </div>
          <div className="mg" style={{ top: "50px" }}>{t.rich("div2", { b0: (c) => <b>{c}</b> })}<span className="av" style={{ background: "#06dec5" }}></span></div>
          <div className="mg en x-m1" style={{ top: "86px" }}>{t.rich("div3", { b0: (c) => <b>{c}</b>, span1: (c) => <span className="url">{c}</span> })}<span className="av" style={{ background: "#e58a3a" }}></span></div>
          <div className="mg en x-a2" style={{ top: "122px" }}>{t.rich("div4", { b0: (c) => <b>{c}</b> })}<span className="av" style={{ background: "#fe4d95" }}></span></div>
          <div className="mg en x-m2" style={{ top: "158px" }}>{t.rich("div5", { b0: (c) => <b>{c}</b>, span1: (c) => <span className="url">{c}</span> })}<span className="av" style={{ background: "#e58a3a" }}></span></div>
          <div className="mg en x-a3" style={{ top: "194px" }}>{t.rich("div6", { b0: (c) => <b>{c}</b> })}<span className="av" style={{ background: "#dcc02e" }}></span></div>
          <div className="din">
            <span className="hint">{t("t9")}</span>
            <span className="pt">
              <span className="u1">https://s.team/remoteplay/QvR7Tk2</span>
              <span className="u2">https://s.team/remoteplay/Lm4Xa9P</span>
            </span>
          </div>
        </div>
        <div className="keys">
          <span className="en x-k1">
            <b>Shift</b>
            <b>Tab</b>
          </span>
          <span className="en x-k2">
            <b>Alt</b>
            <b>Tab</b>
          </span>
          <span className="en x-k3">
            <b>Ctrl</b>
            <b>V</b>
          </span>
          <span className="en x-k4"><b>Enter</b></span>
        </div>
        <div className="stamp en x-stamp">
          <b>{t("t10")}</b>
          <small>{t("t11")}</small>
        </div>
        <div className="cap">
          <div className="cap1">{t.rich("div7", { span0: (c) => <span>{c}</span> })}</div>
          <div className="cap2">{t.rich("div8", { span0: (c) => <span>{c}</span> })}</div>
          <div className="cap3">{t.rich("div9", { span0: (c) => <span>{c}</span> })}</div>
          <div className="cap4">{t.rich("div10", { span0: (c) => <span>{c}</span> })}</div>
          <div className="cap5">{t.rich("div11", { span0: (c) => <span>{c}</span> })}</div>
        </div>
        <div className="ripple r1"></div>
        <div className="ripple r2"></div>
        <svg className="cursor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 2l16 9.5-7 1.6L9.6 20z" fill="#ffffff" stroke="#111d2c" strokeWidth="1.5" strokeLinejoin="round"></path>
        </svg>
      </div>
    </div>
  );
}
