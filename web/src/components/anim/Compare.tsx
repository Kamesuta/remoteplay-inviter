"use client";
import { useRef, type CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { useLoopAnimation, type Beat, type Loop } from "./useLoopAnimation";
import "./Compare.css";

// Both sides run on the same clock: the right side is done long before the left
function compareBeats(): Beat[] {
  const beats: Beat[] = [
    [300, ['rc'], []],
    [700, ['rpn'], []],
    [900, ['rs'], []],
    [1200, ['ra2'], []], [1300, ['ra3'], []], [1400, ['ra4'], []],
    [1700, ['rq2', 'rjp'], []], [1800, ['rq3'], ['rjp']], [1900, ['rq4', 'rjp'], []],
    [1850, ['rr2'], ['rq2']], [1950, ['rr3'], ['rq3', 'rjp']], [2050, ['rr4'], ['rq4']],
    [2300, ['rb2'], ['ra2']], [2380, ['rb3'], ['ra3']], [2460, ['rb4'], ['ra4']],
    [2700, ['rg2', 'rq2'], []], [2800, ['rg3', 'rq3', 'rs2', 'rd2'], ['rg2']],
    [2900, ['rg4', 'rq4', 'rs3', 'rd3'], ['rg3', 'rq2']], [3000, ['rs4', 'rd4'], ['rg4', 'rq3']],
    [3100, [], ['rq4']],
    [3300, ['rdone'], []],
    [300, ['lm1'], []], [600, ['lm2'], []], [900, ['lm3'], []],
    [3600, ['lm5'], []],
  ];
  // The left side: the same overlay chore once per guest
  for (let k = 0; k < 3; k++) {
    const t = 1300 + k * 2200;
    const kf = 'k' + (k + 1);
    beats.push([t, ['lw', 'ov', kf, 'lc1'], []]);
    beats.push([t + 600, ['lp1', 'lk'], []]);
    beats.push([t + 750, [], ['lp1']]);
    beats.push([t + 900, ['lc2'], ['lc1']]);
    beats.push([t + 1300, ['lp2'], []]);
    beats.push([t + 1450, [], ['lp2']]);
    beats.push([t + 1550, [], ['ov', 'lk', 'lc2', kf]]);
    beats.push([t + 1800, ['lh' + (k + 1), 'ls' + (k + 2)], []]);
  }
  beats.push([8000, ['ldone'], ['lw']]);
  return beats;
}

const LOOP: Loop = {
  beats: compareBeats(),
  period: 11000,
};

export default function Compare() {
  const t = useTranslations("anim.cmp");
  const ref = useRef<HTMLDivElement>(null);
  useLoopAnimation(ref, LOOP);
  return (
    <div className="rpa cmp" ref={ref} role="img" aria-label={t("attr1")} style={{ position: "relative", width: "880px", height: "520px", background: "#111d2c", borderRadius: "20px", overflow: "hidden", color: "#ffffff" }}>
      <div className="sc">
        <div className="ab pane pl"></div>
        <div className="ab chip cl">{t("t1")}</div>
        <div className="ab hs hsl">
          <span className="w1">
            <i className="spin"></i>
            {t("t2")}
          </span>
          <span className="w2">
            <i></i>
            {t("t3")}
          </span>
        </div>
        <div className="ab dc dl">
          <div className="dh">{t.rich("div1", { em0: (c) => <em>{c}</em> })}</div>
          <div className="mg en x-lm1" style={{ top: "34px" }}>{t.rich("div2", { b0: (c) => <b>{c}</b> })}<i style={{ background: "#06dec5" }}></i></div>
          <div className="mg en x-lm2" style={{ top: "60px" }}>{t.rich("div3", { b0: (c) => <b>{c}</b> })}<i style={{ background: "#fe4d95" }}></i></div>
          <div className="mg en x-lm3" style={{ top: "86px" }}>{t.rich("div4", { b0: (c) => <b>{c}</b> })}<i style={{ background: "#dcc02e" }}></i></div>
          <div className="mg en x-lh1" style={{ top: "112px" }}>
            <i style={{ background: "#e58a3a" }}></i>
            <b>{t("t4")}</b>
            <s>{t("t5")}</s>
            <u>https://s.team/remoteplay/QvR7Tk2</u>
          </div>
          <div className="mg en x-lm5" style={{ top: "138px" }}>{t.rich("div5", { b0: (c) => <b>{c}</b> })}<i style={{ background: "#fe4d95" }}></i></div>
          <div className="mg en x-lh2" style={{ top: "164px" }}>
            <i style={{ background: "#e58a3a" }}></i>
            <b>{t("t6")}</b>
            <s>{t("t7")}</s>
            <u>https://s.team/remoteplay/Lm4Xa9P</u>
          </div>
          <div className="mg en x-lh3" style={{ top: "190px" }}>
            <i style={{ background: "#e58a3a" }}></i>
            <b>{t("t8")}</b>
            <s>{t("t9")}</s>
            <u>https://s.team/remoteplay/Zp8Wc3N</u>
          </div>
        </div>
        <div className="ab ov en x-ov">
          <div className="ovh">{t.rich("div6", { span0: (c) => <span>{c}</span> })}</div>
          <div className="inv">INVITE ANYONE TO PLAY</div>
          <div className="lr">
            <span className="lt">
              <span className="u1">s.team/remoteplay/QvR7Tk2</span>
              <span className="u2">s.team/remoteplay/Lm4Xa9P</span>
              <span className="u3">s.team/remoteplay/Zp8Wc3N</span>
            </span>
            <span className="cpb">{t("t10")}</span>
          </div>
        </div>
        <div className="ab pt ptl">REMOTE PLAY TOGETHER</div>
        <div className="ab slots sl">
          <div className="slot" style={{ "--c": "#e58a3a" } as CSSProperties}><div className="f">{t.rich("div7", { b0: (c) => <b>{c}</b> })}<i></i></div></div>
          <div className="slot" style={{ "--c": "#06dec5" } as CSSProperties}>
            2P
            <div className="f en x-ls2">{t.rich("div8", { b0: (c) => <b>{c}</b> })}<i></i></div>
          </div>
          <div className="slot" style={{ "--c": "#fe4d95" } as CSSProperties}>
            3P
            <div className="f en x-ls3">{t.rich("div9", { b0: (c) => <b>{c}</b> })}<i></i></div>
          </div>
          <div className="slot" style={{ "--c": "#dcc02e" } as CSSProperties}>
            4P
            <div className="f en x-ls4">{t.rich("div10", { b0: (c) => <b>{c}</b> })}<i></i></div>
          </div>
        </div>
        <div className="ab bd bl en x-ldone">{t("t11")}</div>
        <div className="ab pane pr"></div>
        <div className="ab chip cr">Remote Play Inviter</div>
        <div className="ab hs hsr">
          <span className="w1">
            <i></i>
            {t("t12")}
          </span>
        </div>
        <div className="ab dc dr">
          <div className="dh">{t.rich("div11", { em0: (c) => <em>{c}</em> })}</div>
          <div className="mg en x-rc" style={{ top: "34px" }}>
            <i style={{ background: "#e58a3a" }}></i>
            <b>{t("t13")}</b>
            <code>/steam invite</code>
          </div>
          <div className="pn en x-rpn">
            <div className="nm">
              Remote Play Inviter
              <em>{t("t14")}</em>
            </div>
            <div className="bn">POCO PARK 2</div>
          </div>
          <div className="jn en x-rpn">{t("t15")}</div>
          <div className="ep e2 en x-rr2" style={{ "--c": "#06dec5" } as CSSProperties}>{t.rich("div12", { small0: (c) => <small>{c}</small>, span1: (c) => <span className="go">{c}</span> })}</div>
          <div className="ep e3 en x-rr3" style={{ "--c": "#fe4d95" } as CSSProperties}>{t.rich("div13", { small0: (c) => <small>{c}</small>, span1: (c) => <span className="go">{c}</span> })}</div>
          <div className="ep e4 en x-rr4" style={{ "--c": "#dcc02e" } as CSSProperties}>{t.rich("div14", { small0: (c) => <small>{c}</small>, span1: (c) => <span className="go">{c}</span> })}</div>
        </div>
        <div className="ab pt ptr">REMOTE PLAY TOGETHER</div>
        <div className="ab slots sr">
          <div className="slot" style={{ "--c": "#e58a3a" } as CSSProperties}><div className="f">{t.rich("div15", { b0: (c) => <b>{c}</b> })}<i></i></div></div>
          <div className="slot" style={{ "--c": "#06dec5" } as CSSProperties}>
            2P
            <div className="f en x-rs2">{t.rich("div16", { b0: (c) => <b>{c}</b> })}<i></i></div>
          </div>
          <div className="slot" style={{ "--c": "#fe4d95" } as CSSProperties}>
            3P
            <div className="f en x-rs3">{t.rich("div17", { b0: (c) => <b>{c}</b> })}<i></i></div>
          </div>
          <div className="slot" style={{ "--c": "#dcc02e" } as CSSProperties}>
            4P
            <div className="f en x-rs4">{t.rich("div18", { b0: (c) => <b>{c}</b> })}<i></i></div>
          </div>
        </div>
        <div className="ab bd br en x-rdone">{t("t16")}</div>
        <div className="cur cu-h" style={{ "--c": "#e58a3a" } as CSSProperties}>
          <i className="rg"></i>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 2l16 9.5-7 1.6L9.6 20z" fill="#e58a3a" stroke="#ffffff" strokeWidth="1.5" strokeLinejoin="round"></path>
          </svg>
          <b>{t("t17")}</b>
        </div>
        <div className="cur cu-2" style={{ "--c": "#06dec5" } as CSSProperties}>
          <i className="rg"></i>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 2l16 9.5-7 1.6L9.6 20z" fill="#06dec5" stroke="#ffffff" strokeWidth="1.5" strokeLinejoin="round"></path>
          </svg>
          <b>{t("t18")}</b>
        </div>
        <div className="cur cu-3" style={{ "--c": "#fe4d95" } as CSSProperties}>
          <i className="rg"></i>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 2l16 9.5-7 1.6L9.6 20z" fill="#fe4d95" stroke="#ffffff" strokeWidth="1.5" strokeLinejoin="round"></path>
          </svg>
          <b>{t("t19")}</b>
        </div>
        <div className="cur cu-4" style={{ "--c": "#dcc02e" } as CSSProperties}>
          <i className="rg"></i>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 2l16 9.5-7 1.6L9.6 20z" fill="#dcc02e" stroke="#ffffff" strokeWidth="1.5" strokeLinejoin="round"></path>
          </svg>
          <b>{t("t20")}</b>
        </div>
      </div>
    </div>
  );
}
