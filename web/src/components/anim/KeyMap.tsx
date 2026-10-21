"use client";
import { useRef, type CSSProperties } from "react";
import { useTranslations } from "next-intl";
import { useLoopAnimation, type Beat, type Loop } from "./useLoopAnimation";
import "./KeyMap.css";

// Keys are pressed one at a time, then the whole map is shown
function keyBeats(): Beat[] {
  const beats: Beat[] = [];
  for (let i = 1; i <= 8; i++) beats.push([400 + (i - 1) * 650, ['p' + i], i > 1 ? ['p' + (i - 1)] : []]);
  beats.push([5600, ['done'], ['p8']]);
  return beats;
}

const LOOP: Loop = { beats: keyBeats(), period: 7600 };

export default function KeyMap() {
  const t = useTranslations("anim.kmp");
  const ref = useRef<HTMLDivElement>(null);
  useLoopAnimation(ref, LOOP);
  return (
    <div className="rpa kmp" ref={ref} role="img" aria-label={t("attr1")} style={{ position: "relative", width: "880px", height: "440px", background: "#111d2c", borderRadius: "20px", overflow: "hidden", color: "#ffffff" }}>
      <div className="sc">
        <div className="ab" style={{ left: "30px", top: "36px", fontFamily: "var(--font-dot), monospace", fontSize: "14px", color: "#8fa3b6" }}>KEYBOARD</div>
        <div className="ab" style={{ left: "560px", top: "36px", fontFamily: "var(--font-dot), monospace", fontSize: "14px", color: "#8fa3b6" }}>XBOX CONTROLLER</div>
        <div className="ab kb"></div>
        <span className="ab k" style={{ left: "46px", top: "120px" }}>Q</span>
        <span className="ab k m kW" style={{ left: "86px", top: "120px", "--c": "#06dec5" } as CSSProperties}>W</span>
        <span className="ab k" style={{ left: "126px", top: "120px" }}>E</span>
        <span className="ab k" style={{ left: "166px", top: "120px" }}>R</span>
        <span className="ab k" style={{ left: "206px", top: "120px" }}>T</span>
        <span className="ab k" style={{ left: "246px", top: "120px" }}>Y</span>
        <span className="ab k" style={{ left: "286px", top: "120px" }}>U</span>
        <span className="ab k m kI" style={{ left: "326px", top: "120px", "--c": "#f2c230" } as CSSProperties}>I</span>
        <span className="ab k" style={{ left: "366px", top: "120px" }}>O</span>
        <span className="ab k" style={{ left: "406px", top: "120px" }}>P</span>
        <span className="ab k m kA" style={{ left: "58px", top: "160px", "--c": "#06dec5" } as CSSProperties}>A</span>
        <span className="ab k m kS" style={{ left: "98px", top: "160px", "--c": "#06dec5" } as CSSProperties}>S</span>
        <span className="ab k m kD" style={{ left: "138px", top: "160px", "--c": "#06dec5" } as CSSProperties}>D</span>
        <span className="ab k" style={{ left: "178px", top: "160px" }}>F</span>
        <span className="ab k" style={{ left: "218px", top: "160px" }}>G</span>
        <span className="ab k" style={{ left: "258px", top: "160px" }}>H</span>
        <span className="ab k m kJ" style={{ left: "298px", top: "160px", "--c": "#3b8bff" } as CSSProperties}>J</span>
        <span className="ab k m kK" style={{ left: "338px", top: "160px", "--c": "#4cc25a" } as CSSProperties}>K</span>
        <span className="ab k m kL" style={{ left: "378px", top: "160px", "--c": "#f0584c" } as CSSProperties}>L</span>
        <span className="ab k" style={{ left: "70px", top: "200px" }}>Z</span>
        <span className="ab k" style={{ left: "110px", top: "200px" }}>X</span>
        <span className="ab k" style={{ left: "150px", top: "200px" }}>C</span>
        <span className="ab k" style={{ left: "190px", top: "200px" }}>V</span>
        <span className="ab k" style={{ left: "230px", top: "200px" }}>B</span>
        <span className="ab k" style={{ left: "270px", top: "200px" }}>N</span>
        <span className="ab k" style={{ left: "310px", top: "200px" }}>M</span>
        <span className="ab sp"></span>
        <svg className="ab arrow" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12h15M13 6l6 6-6 6"></path></svg>
        <svg className="ab pad" viewBox="0 0 200 140" aria-hidden="true">
          <path d="M40 50 C40 36 54 31 70 33 L130 33 C146 31 160 36 160 50 L172 100 C176 121 150 128 138 108 L128 92 L72 92 L62 108 C50 128 24 121 28 100 Z" fill="#e9edf2" stroke="#c9d1da" strokeWidth="1.5"></path>
          <rect x="56" y="26" width="26" height="6" rx="3" fill="#c9d1da"></rect>
          <rect x="118" y="26" width="26" height="6" rx="3" fill="#c9d1da"></rect>
        </svg>
        <span className="ab ring" style={{ left: "590px", top: "137px" }}></span>
        <span className="ab knob" style={{ left: "594px", top: "141px" }}></span>
        <span className="ab dp" style={{ left: "624px", top: "184px" }}>
          <i style={{ left: "10px", top: "0", width: "10px", height: "30px" }}></i>
          <i style={{ left: "0", top: "10px", width: "30px", height: "10px" }}></i>
        </span>
        <span className="ab ring" style={{ left: "679px", top: "191px" }}></span>
        <span className="ab knob" style={{ left: "683px", top: "195px", transition: "none" }}></span>
        <span className="ab bt bY" style={{ left: "720px", top: "124px", background: "#f2c230" }}>Y</span>
        <span className="ab bt bX" style={{ left: "702px", top: "140px", background: "#3b8bff" }}>X</span>
        <span className="ab bt bB" style={{ left: "738px", top: "140px", background: "#f0584c" }}>B</span>
        <span className="ab bt bA" style={{ left: "720px", top: "156px", background: "#4cc25a" }}>A</span>
        <div className="ab cap">
          <div className="c1">
            <b>W</b>
            <span>→</span>
            <em style={{ "--c": "#06dec5" } as CSSProperties}>{t("t1")}</em>
          </div>
          <div className="c2">
            <b>A</b>
            <span>→</span>
            <em style={{ "--c": "#06dec5" } as CSSProperties}>{t("t2")}</em>
          </div>
          <div className="c3">
            <b>S</b>
            <span>→</span>
            <em style={{ "--c": "#06dec5" } as CSSProperties}>{t("t3")}</em>
          </div>
          <div className="c4">
            <b>D</b>
            <span>→</span>
            <em style={{ "--c": "#06dec5" } as CSSProperties}>{t("t4")}</em>
          </div>
          <div className="c5">
            <b>K</b>
            <span>→</span>
            <em style={{ "--c": "#4cc25a" } as CSSProperties}>{t("t5")}</em>
          </div>
          <div className="c6">
            <b>L</b>
            <span>→</span>
            <em style={{ "--c": "#f0584c" } as CSSProperties}>{t("t6")}</em>
          </div>
          <div className="c7">
            <b>J</b>
            <span>→</span>
            <em style={{ "--c": "#3b8bff" } as CSSProperties}>{t("t7")}</em>
          </div>
          <div className="c8">
            <b>I</b>
            <span>→</span>
            <em style={{ "--c": "#f2c230" } as CSSProperties}>{t("t8")}</em>
          </div>
          <div className="c9"><em style={{ "--c": "#a4d007" } as CSSProperties}>{t("t9")}</em></div>
        </div>
      </div>
    </div>
  );
}
