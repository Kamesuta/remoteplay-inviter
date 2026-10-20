"use client";
import { useRef, type CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { useLoopAnimation, type Loop } from "./useLoopAnimation";
import "./InviteFlow.css";

const LOOP: Loop = {
  beats: [
    [300, ['h1', 'st1', 's-typing'], []],
    [1100, ['s-panel'], []],
    [1400, ['h2'], ['h1']],
    // 2P presses the button and gets a link only on their screen
    [1700, ['a2', 'st2'], ['st1']],
    [2300, ['q2', 'jp'], []],
    [2450, [], ['jp']],
    [2550, ['r2'], ['q2']],
    [2900, ['b2'], ['a2']],
    [3400, ['g2', 'q2'], []],
    [3550, [], ['g2']],
    [3600, ['d2'], ['b2', 'q2']],
    // 3P and 4P do the same, each on their own PC
    [3900, ['a3', 'st3'], ['st2']],
    [4050, ['a4'], []],
    [4500, ['q3', 'jp'], []],
    [4620, [], ['jp']],
    [4700, ['r3', 'q4', 'jp'], ['q3']],
    [4820, [], ['jp']],
    [4900, ['r4'], ['q4']],
    [5100, ['b3'], ['a3']],
    [5250, ['b4'], ['a4']],
    [5600, ['g3', 'q3'], []],
    [5720, [], ['g3']],
    [5750, ['g4', 'q4'], []],
    [5870, [], ['g4']],
    [5900, ['d3'], ['b3', 'q3']],
    [6050, ['d4'], ['b4', 'q4']],
    [6400, ['st4', 's-note'], ['st3']],
  ],
  period: 9200,
  finalFlags: ['s-panel', 'h2', 'r2', 'r3', 'r4', 'd2', 'd3', 'd4', 's-note', 'st4'],
};

export default function InviteFlow() {
  const t = useTranslations("anim.ifl");
  const ref = useRef<HTMLDivElement>(null);
  useLoopAnimation(ref, LOOP);
  return (
    <div className="rpa ifl" ref={ref} role="img" aria-label={t("attr1")} style={{ position: "relative", width: "960px", height: "680px", background: "#111d2c", borderRadius: "22px", overflow: "hidden", color: "#ffffff" }}>
      <div className="scene">
        <div className="abs dc"></div>
        <div className="abs dc-side">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="abs dc-head">{t.rich("div1", { b0: (c) => <b>{c}</b> })}</div>
        <div className="abs ph-msg">
          <i></i>
          <div>
            <u style={{ width: "90px" }}></u>
            <u style={{ width: "220px" }}></u>
          </div>
        </div>
        <div className="abs bot-av enter">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#66c0f4" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 11h4M8 9v4M15 12h.01M18 10h.01"></path>
            <path d="M17.3 5H6.7a4 4 0 0 0-4 3.6L2 15a3 3 0 0 0 5.3 2l1.2-1.5h7l1.2 1.5A3 3 0 0 0 22 15l-.7-6.4a4 4 0 0 0-4-3.6z"></path>
          </svg>
        </div>
        <div className="abs bot-name enter">
          Remote Play Inviter
          <em>{t("t1")}</em>
        </div>
        <div className="abs embed enter">
          <div className="banner">
            <b>POCO PARK 2</b>
            <div>
              <span style={{ background: "#8c7ae6" }}></span>
              <span style={{ background: "#f5b342" }}></span>
              <span style={{ background: "#e05d5d" }}></span>
              <span style={{ background: "#4aa3df" }}></span>
              <span style={{ background: "#5fc27e" }}></span>
            </div>
          </div>
          <p>{t("t2")}</p>
        </div>
        <div className="abs join enter">{t("t3")}</div>
        <div className="abs eph y2 enter" style={{ "--c": "#06dec5" } as CSSProperties}>
          <div>
            <small>{t("t4")}</small>
            <strong>{t("t5")}</strong>
          </div>
          <span className="go">{t("t6")}</span>
        </div>
        <div className="abs eph y3 enter" style={{ "--c": "#fe4d95" } as CSSProperties}>
          <div>
            <small>{t("t7")}</small>
            <strong>{t("t8")}</strong>
          </div>
          <span className="go">{t("t9")}</span>
        </div>
        <div className="abs eph y4 enter" style={{ "--c": "#dcc02e" } as CSSProperties}>
          <div>
            <small>{t("t10")}</small>
            <strong>{t("t11")}</strong>
          </div>
          <span className="go">{t("t12")}</span>
        </div>
        <div className="abs input">
          <span className="hint">{t("t13")}</span>
          <span className="typed">/steam invite</span>
        </div>
        <div className="abs cap">
          <div className="cap1">{t.rich("div2", { span0: (c) => <span>{c}</span> })}</div>
          <div className="cap2">{t.rich("div3", { span0: (c) => <span>{c}</span> })}</div>
          <div className="cap3">{t.rich("div4", { span0: (c) => <span>{c}</span> })}</div>
          <div className="cap4">{t.rich("div5", { span0: (c) => <span>{c}</span> })}</div>
        </div>
        <div className="abs steam">
          <h3>REMOTE PLAY TOGETHER</h3>
          <div className="game">POCO PARK 2</div>
          <div className="slots">
            <div className="slot">
              1P
              <div className="fill shown">{t.rich("div6", { b0: (c) => <b>{c}</b>, small1: (c) => <small>{c}</small> })}<i style={{ background: "#e58a3a" }}></i></div>
            </div>
            <div className="slot">
              {t("t14")}
              <div className="fill f2 enter">{t.rich("div7", { b0: (c) => <b>{c}</b>, small1: (c) => <small>{c}</small> })}<i style={{ background: "#06dec5" }}></i></div>
            </div>
            <div className="slot">
              {t("t15")}
              <div className="fill f3 enter">{t.rich("div8", { b0: (c) => <b>{c}</b>, small1: (c) => <small>{c}</small> })}<i style={{ background: "#fe4d95" }}></i></div>
            </div>
            <div className="slot">
              {t("t16")}
              <div className="fill f4 enter">{t.rich("div9", { b0: (c) => <b>{c}</b>, small1: (c) => <small>{c}</small> })}<i style={{ background: "#dcc02e" }}></i></div>
            </div>
          </div>
        </div>
        <div className="abs note enter">{t("t17")}</div>
        <div className="cur cur-h" style={{ "--c": "#e58a3a" } as CSSProperties}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 2l16 9.5-7 1.6L9.6 20z" fill="#e58a3a" stroke="#ffffff" strokeWidth="1.5" strokeLinejoin="round"></path>
          </svg>
          <b>{t("t18")}</b>
        </div>
        <div className="cur cur-2" style={{ "--c": "#06dec5" } as CSSProperties}>
          <i className="rg"></i>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 2l16 9.5-7 1.6L9.6 20z" fill="#06dec5" stroke="#ffffff" strokeWidth="1.5" strokeLinejoin="round"></path>
          </svg>
          <b>{t("t19")}</b>
        </div>
        <div className="cur cur-3" style={{ "--c": "#fe4d95" } as CSSProperties}>
          <i className="rg"></i>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 2l16 9.5-7 1.6L9.6 20z" fill="#fe4d95" stroke="#ffffff" strokeWidth="1.5" strokeLinejoin="round"></path>
          </svg>
          <b>{t("t20")}</b>
        </div>
        <div className="cur cur-4" style={{ "--c": "#dcc02e" } as CSSProperties}>
          <i className="rg"></i>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 2l16 9.5-7 1.6L9.6 20z" fill="#dcc02e" stroke="#ffffff" strokeWidth="1.5" strokeLinejoin="round"></path>
          </svg>
          <b>{t("t21")}</b>
        </div>
      </div>
    </div>
  );
}
