"use client";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useLoopAnimation, type Loop } from "./useLoopAnimation";
import "./Phone.css";

const LOOP: Loop = {
  beats: [
    [200, ['n1', 'L1'], []],
    [900, ['T0'], []],
    [1050, ['e1'], ['n1']],
    [1500, [], ['T0']],
    [1750, ['T1', 'jp'], []],
    [1900, [], ['jp']],
    [2000, ['rp'], []],
    [2300, [], ['T1']],
    [2650, ['T2', 'bp'], []],
    [2800, [], ['bp']],
    [2950, ['p2', 'L2'], ['L1', 'T2']],
    [4150, ['p3'], []],
    [4750, ['p4'], []],
    [5150, ['p5', 'L3'], ['L2']],
    [5450, ['p6'], []],
  ],
  period: 8200,
  finalFlags: ['e1', 'rp', 'p2', 'p3', 'p4', 'p5', 'p6', 'L3'],
};

export default function Phone() {
  const t = useTranslations("anim.phn");
  const ref = useRef<HTMLDivElement>(null);
  useLoopAnimation(ref, LOOP);
  return (
    <div className="rpa phn" ref={ref} role="img" aria-label={t("attr1")} style={{ position: "relative", width: "420px", height: "520px", background: "#111d2c", borderRadius: "22px", overflow: "hidden", color: "#ffffff" }}>
      <div className="sc">
        <div className="lbl">
          <span className="l1">{t("t1")}</span>
          <span className="l2">{t("t2")}</span>
          <span className="l3">{t("t3")}</span>
        </div>
        <div className="ph">
          <div className="scr">
            <div className="la">
              <div className="dh">{t.rich("div1", { em0: (c) => <em>{c}</em> })}<i></i></div>
              <div className="bt en x-e1">
                <i></i>
                Remote Play Inviter
                <em>{t("t4")}</em>
              </div>
              <div className="em en x-e1">
                <div className="bn">
                  <b>POCO PARK 2</b>
                  <span>
                    <i style={{ background: "#8c7ae6" }}></i>
                    <i style={{ background: "#f5b342" }}></i>
                    <i style={{ background: "#e05d5d" }}></i>
                    <i style={{ background: "#4aa3df" }}></i>
                    <i style={{ background: "#5fc27e" }}></i>
                  </span>
                </div>
                <p>{t("t5")}</p>
              </div>
              <div className="gb en x-e1">{t("t6")}</div>
              <div className="ep en x-rp">
                <small>{t("t7")}</small>
                <strong>{t("t8")}</strong>
                <div className="bb">{t("t9")}</div>
              </div>
              <div className="in">{t("t10")}</div>
              <div className="nb">
                <i>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l.9-4.6A8 8 0 1 1 21 12z"></path></svg>
                </i>
                <div>
                  <small>{t("t11")}</small>
                  <strong>{t("t12")}</strong>
                </div>
              </div>
              <span className="tp tp0"></span>
              <span className="tp tp1"></span>
              <span className="tp tp2"></span>
            </div>
            <div className="lb">
              <span className="ring"><i></i></span>
              <b>Steam Link</b>
              <small>{t("t13")}</small>
              <span className="pg"><i></i></span>
            </div>
            <div className="lc">
              <span className="tt">POCO PARK 2</span>
              <span className="pf" style={{ left: "150px", bottom: "74px", width: "80px" }}></span>
              <span className="pf" style={{ left: "262px", bottom: "104px", width: "64px" }}></span>
              <span className="pl" style={{ left: "116px", background: "#e58a3a" }}></span>
              <span className="pl" style={{ left: "146px", background: "#06dec5", animationDelay: ".15s" }}></span>
              <span className="pl" style={{ left: "176px", background: "#fe4d95", animationDelay: ".3s" }}></span>
              <span className="pl" style={{ left: "206px", background: "#dcc02e", animationDelay: ".45s" }}></span>
              <span className="gr"></span>
              <div className="pad">
                <div className="dp">
                  <i style={{ left: "18px", top: "0", width: "18px", height: "54px" }}></i>
                  <i style={{ left: "0", top: "18px", width: "54px", height: "18px" }}></i>
                </div>
                <div className="ab">
                  <i></i>
                  <i></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bd">{t("t14")}</div>
      </div>
    </div>
  );
}
