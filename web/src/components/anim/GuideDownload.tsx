"use client";
import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useLoopAnimation, type Loop } from "./useLoopAnimation";
import "./x360.css";
import "./GuideDownload.css";

const LOOP: Loop = {
  beats: [
    [400, ['sp'], []],
    [1100, ['c1'], []],
    [1800, ['p1'], []],
    [1950, ['z1'], ['p1']],
    [2900, ['e1', 'c2'], ['c1', 'sp']],
    [3600, ['p2', 'm1'], []],
    [3750, [], ['p2']],
    [4100, ['c3'], ['c2']],
    [4700, ['p3'], []],
    [4850, ['x1'], ['p3', 'm1']],
    [5200, ['hl', 'ca'], ['c3']],
  ],
  period: 7800,
};

export default function GuideDownload() {
  const t = useTranslations("anim.gdl");
  const ref = useRef<HTMLDivElement>(null);
  useLoopAnimation(ref, LOOP);
  return (
    <div className="rpa xa gdl" ref={ref} role="img" aria-label={t("attr1")} style={{ position: "relative", width: "720px", height: "440px", background: "#111d2c", borderRadius: "18px", overflow: "hidden" }}>
      <div className="sc">
        <div className="ab win" style={{ left: "16px", top: "14px", width: "688px", height: "412px", background: "#dee1e6", overflow: "hidden" }}>
          <div className="ab" style={{ left: "8px", top: "6px", width: "210px", height: "22px", borderRadius: "7px 7px 0 0", background: "#ffffff", fontSize: "10.5px", color: "#333333", padding: "4px 10px", whiteSpace: "nowrap", overflow: "hidden" }}>Xbox 360 Controller Emulator</div>
          <div className="ab" style={{ left: "0", top: "28px", width: "688px", height: "26px", background: "#ffffff", borderBottom: "1px solid #e5e5e5" }}></div>
          <div className="ab" style={{ left: "40px", top: "32px", width: "320px", height: "18px", borderRadius: "999px", background: "#f1f3f4", fontSize: "10px", color: "#3c4043", padding: "2px 12px" }}>x360ce.com</div>
          <div className="ab" style={{ left: "0", top: "54px", width: "688px", height: "358px", overflow: "hidden" }}>
            <div className="site">
              <span className="s" style={{ left: "-50px", top: "240px", width: "170px", height: "300px", borderRadius: "50%", background: "#e9edf2", opacity: ".55" }}></span>
              <span className="s" style={{ left: "1097px", top: "-40px", width: "140px", height: "220px", borderRadius: "50%", background: "#e9edf2", opacity: ".85" }}></span>
              <div className="s sb"></div>
              <div className="s si on" style={{ top: "24px" }}>HOMEPAGE</div>
              <div className="s si" style={{ top: "47px" }}>TOP GAMES</div>
              <div className="s si" style={{ top: "70px" }}>TOP DEVICES</div>
              <div className="s si" style={{ top: "93px" }}>KEYBOARDS</div>
              <div className="s si" style={{ top: "116px" }}>CONTROLLERS</div>
              <div className="s si" style={{ top: "139px" }}>HARDWARE</div>
              <div className="s si" style={{ top: "162px" }}>FAQ</div>
              <div className="s si" style={{ top: "185px" }}>FORUM</div>
              <div className="s si" style={{ top: "208px" }}>COMMENTS</div>
              <div className="s" style={{ left: "165px", top: "4px", width: "980px", height: "97px", borderRadius: "14px", background: "#2674ec" }}></div>
              <div className="s" style={{ left: "165px", top: "20px", width: "980px", textAlign: "center", fontSize: "19px", color: "#80ceff", whiteSpace: "nowrap" }}>X360CE • Xbox 360 Controller Emulator • 2010 ... 2026</div>
              <div className="s" style={{ left: "933px", top: "8px", width: "131px", height: "18px", background: "#dddddd", display: "flex", alignItems: "center", gap: "4px", paddingLeft: "4px", fontSize: "14px", color: "#444444", whiteSpace: "nowrap" }}>
                <i style={{ flex: "none", width: "16px", height: "11px", background: "linear-gradient(#ed2939 33%, #ffffff 33% 66%, #ed2939 66%)", display: "block" }}></i>
                Austrian Version
              </div>
              <div className="s pl" style={{ left: "201px" }}>Version 4.x Download & Help</div>
              <div className="s pl" style={{ left: "400px" }}>Version 3.x Download & Help</div>
              <div className="s pl" style={{ left: "599px" }}>FAQ</div>
              <div className="s pl" style={{ left: "644px" }}>Issues (GitHub.com)</div>
              <div className="s pl" style={{ left: "792px" }}>Source (GitHub.com)</div>
              <div className="s pl" style={{ left: "943px" }}>Version Updates & Fixes</div>
              <div className="s" style={{ left: "165px", top: "105px", width: "980px", height: "207px", borderRadius: "14px", background: "#dddddd" }}></div>
              <div className="s th" style={{ left: "306px", top: "125px", width: "220px" }}>Version 4.26.38 • 2026-10-17</div>
              <div className="s tb" style={{ left: "306px", top: "155px", width: "220px" }}></div>
              <div className="s td" style={{ left: "306px", top: "190px", width: "220px" }}>Emulates virtual gamepads with ViGEmBus.</div>
              <div className="s th" style={{ left: "532px", top: "125px", width: "472px" }}>Version 3.7.8 • 2026-10-17</div>
              <div className="s tb" style={{ left: "532px", top: "155px", width: "472px" }}></div>
              <div className="s td" style={{ left: "532px", top: "190px", width: "472px" }}>
                GUI for editing the x360ce.ini file and managing XInput DLLs. Can be closed during the game.
              </div>
              <div className="s db d4" style={{ left: "312px", width: "208px" }}>
                <i>⬇</i>
                <b>DOWNLOAD FOR ALL GAMES</b>
              </div>
              <div className="s db" style={{ left: "538px", width: "227px" }}>
                <i>⬇</i>
                <b>DOWNLOAD FOR 32-BIT GAMES</b>
              </div>
              <div className="s db" style={{ left: "771px", width: "227px" }}>
                <i>⬇</i>
                <b>DOWNLOAD FOR 64-BIT GAMES</b>
              </div>
              <span className="s" style={{ left: "185px", top: "228px", width: "64px", height: "64px", borderRadius: "50%", background: "#bdbdbd" }}></span>
              <span className="s" style={{ left: "264px", top: "245px", width: "40px", height: "30px", border: "3px solid #bdbdbd", borderRadius: "3px" }}></span>
              <span className="s" style={{ left: "319px", top: "228px", width: "64px", height: "64px", borderRadius: "50%", background: "#bdbdbd" }}></span>
              <span className="s" style={{ left: "399px", top: "240px", width: "726px", height: "9px", borderRadius: "5px", background: "#b9b9b9" }}></span>
              <span className="s" style={{ left: "399px", top: "258px", width: "700px", height: "9px", borderRadius: "5px", background: "#b9b9b9" }}></span>
              <span className="s" style={{ left: "399px", top: "276px", width: "520px", height: "9px", borderRadius: "5px", background: "#b9b9b9" }}></span>
              <span className="s" style={{ left: "929px", top: "276px", width: "96px", height: "9px", borderRadius: "5px", background: "#3a9a3a" }}></span>
              <span className="s" style={{ left: "165px", top: "316px", width: "190px", height: "92px", background: "#fdf8dc", border: "1px solid #e9e2b0" }}></span>
              <span className="s" style={{ left: "362px", top: "316px", width: "190px", height: "92px", background: "#fdf8dc", border: "1px solid #e9e2b0" }}></span>
              <span className="s" style={{ left: "559px", top: "316px", width: "190px", height: "92px", background: "#fdf8dc", border: "1px solid #e9e2b0" }}></span>
              <span className="s" style={{ left: "756px", top: "316px", width: "190px", height: "92px", background: "#fdf8dc", border: "1px solid #e9e2b0" }}></span>
              <span className="s" style={{ left: "953px", top: "316px", width: "190px", height: "92px", background: "#fdf8dc", border: "1px solid #e9e2b0" }}></span>
              <div className="s" style={{ left: "165px", top: "446px", width: "980px", height: "200px", borderRadius: "14px 14px 0 0", background: "#2b2b2b", color: "#ffffff", fontSize: "12px", textAlign: "center", paddingTop: "6px" }}>X360CE ADVERTISEMENT • HIDE</div>
            </div>
          </div>
        </div>
        <div className="ab dim"></div>
        <div className="ab ring"></div>
        <div className="ab en x-sp" style={{ left: "420px", top: "157px", height: "24px", padding: "0 12px", borderRadius: "999px", background: "#3d4552", color: "#ffffff", fontSize: "11px", fontWeight: "900", display: "grid", placeItems: "center", whiteSpace: "nowrap" }}>{t("t1")}</div>
        <div className="ab en x-sp" style={{ left: "172px", top: "212px", height: "34px", padding: "0 16px", borderRadius: "999px", background: "#a4d007", color: "#16210a", fontSize: "13px", fontWeight: "900", display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>
          {t("t2")}
          <span style={{ position: "absolute", left: "90px", top: "-6px", width: "12px", height: "12px", background: "#a4d007", transform: "rotate(45deg)" }}></span>
        </div>
        <div className="ab en x-z1" style={{ left: "474px", top: "64px", width: "216px", height: "54px", borderRadius: "10px", background: "#ffffff", border: "1px solid #e5e5e5", boxShadow: "0 10px 24px rgba(0,0,0,.25)", display: "flex", alignItems: "center", gap: "10px", padding: "0 12px", fontSize: "11px", color: "#1f1f1f" }}>
          <span style={{ width: "24px", height: "28px", borderRadius: "3px", background: "#f2c230", display: "block", flex: "none" }}></span>
          <div>
            <b style={{ display: "block" }}>x360ce.zip</b>
            <span style={{ color: "#1e8e3e", fontSize: "10px" }}>{t("t3")}</span>
          </div>
        </div>
        <div className="ab win exp en x-e1" style={{ left: "190px", top: "196px", width: "500px", height: "222px", background: "#ffffff" }}>
          <div className="ttl" style={{ background: "#f3f3f3" }}>
            <i style={{ background: "#f2c230" }}></i>
            {t("t4")}
          </div>
        </div>
        <div className="ab en x-e1" style={{ left: "220px", top: "238px", width: "80px", height: "72px", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "10px", color: "#1f1f1f" }}>
          <span style={{ position: "relative", width: "44px", height: "36px", borderRadius: "4px", background: "#f2c230", display: "block" }}>
            <i style={{ position: "absolute", left: "19px", top: "0", width: "6px", height: "36px", background: "repeating-linear-gradient(#8a6d00 0 4px, transparent 4px 8px)", display: "block" }}></i>
          </span>
          x360ce.zip
        </div>
        <div className="ab en x-x1" style={{ left: "330px", top: "238px", width: "90px", height: "72px", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", fontSize: "10px", color: "#1f1f1f" }}>
          <span style={{ width: "40px", height: "36px", borderRadius: "6px", background: "#3d4552", display: "grid", placeItems: "center" }}>
            <svg width="24" height="17" viewBox="0 0 200 140" aria-hidden="true">
              <path d="M40 50 C40 36 54 31 70 33 L130 33 C146 31 160 36 160 50 L172 100 C176 121 150 128 138 108 L128 92 L72 92 L62 108 C50 128 24 121 28 100 Z" fill="#e9edf2"></path>
            </svg>
          </span>
          <b>x360ce.exe</b>
        </div>
        <div className="ab hl" style={{ left: "334px", top: "232px", width: "82px", height: "82px" }}></div>
        <div className="ab en x-m1" style={{ left: "272px", top: "270px", width: "140px", height: "62px", borderRadius: "6px", background: "#ffffff", border: "1px solid #d9d9d9", boxShadow: "0 8px 20px rgba(0,0,0,.25)", padding: "6px 4px", fontSize: "10.5px", color: "#1f1f1f" }}>
          <div style={{ height: "22px", display: "flex", alignItems: "center", paddingLeft: "10px" }}>{t("t5")}</div>
          <div style={{ height: "24px", display: "flex", alignItems: "center", paddingLeft: "10px", borderRadius: "4px", background: "#e5f1fb", fontWeight: "700" }}>{t("t6")}</div>
        </div>
        <div className="ab rg r1"></div>
        <div className="ab rg r2"></div>
        <div className="ab rg r3"></div>
        <svg className="cur" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 2l16 9.5-7 1.6L9.6 20z" fill="#ffffff" stroke="#111d2c" strokeWidth="1.5" strokeLinejoin="round"></path>
        </svg>
      </div>
    </div>
  );
}
