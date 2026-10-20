import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import CopyButton from "@/components/guide/CopyButton";
import { PRESET_MAIN, PRESET_OVERCOOKED } from "@/components/guide/presets";
import GuideDownload from "@/components/anim/GuideDownload";
import GuideIssues from "@/components/anim/GuideIssues";
import GuideAdd from "@/components/anim/GuideAdd";
import GuidePaste from "@/components/anim/GuidePaste";
import GuideCheck from "@/components/anim/GuideCheck";

export default function GuideSteps() {
  const t = useTranslations("guide.steps");
  return (
    <section id="steps" style={{ marginTop: "136px", background: "var(--t-band)", borderRadius: "56px 56px 0 0", borderTop: "var(--t-bw) solid var(--t-card-line)" }}>
      <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "96px 24px 0" }}>
        <div style={{ fontFamily: "var(--font-dot), monospace", fontSize: "15px", letterSpacing: "0.1em", color: "var(--t-hl)" }}>HOW TO</div>
        <h2 style={{ margin: "6px 0 0", fontFamily: "var(--font-dela), sans-serif", fontWeight: "400", fontSize: "clamp(28px, 4vw, 48px)", lineHeight: "1.35" }}>{t.rich("h21", { span0: (c) => <span style={{ color: "var(--t-hl)", background: "linear-gradient(transparent 64%, var(--t-mark) 64%)", padding: "0 0.06em" }}>{c}</span> })}</h2>
        <p style={{ margin: "10px 0 0", color: "var(--t-sub)" }}>{t("t1")}</p>
        {/* Step 1 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "32px 48px", alignItems: "center", marginTop: "64px" }}>
          <div style={{ flex: "1 1 300px", minWidth: "0" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "14px" }}>
              <span style={{ fontFamily: "var(--font-dela), sans-serif", fontSize: "56px", lineHeight: "1", color: "var(--t-hl)" }}>1</span>
              <h3 style={{ margin: "0", fontSize: "24px" }}>{t("t2")}</h3>
            </div>
            <ol style={{ margin: "14px 0 0", paddingLeft: "20px", color: "var(--t-sub)" }}>
              <li>{t.rich("li1", { b0: (c) => <b style={{ color: "var(--t-ink)" }}>{c}</b>, b1: (c) => <b style={{ color: "var(--t-ink)" }}>{c}</b> })}</li>
              <li>{t("t3")}</li>
              <li>{t.rich("li2", { b0: (c) => <b style={{ color: "var(--t-ink)" }}>{c}</b> })}</li>
              <li>{t.rich("li3", { b0: (c) => <b style={{ color: "var(--t-ink)" }}>{c}</b> })}</li>
            </ol>
            <a className="pill" href="https://www.x360ce.com/" style={{ display: "inline-flex", alignItems: "center", marginTop: "16px", background: "var(--t-dl)", color: "var(--t-dl-ink)", textDecoration: "none", fontWeight: "700", fontSize: "14px", padding: "0 18px", minHeight: "44px", borderRadius: "999px", boxShadow: "0 4px 0 var(--t-dl-shadow)" }}>{t("t4")}</a>
          </div>
          <div className="rv" style={{ flex: "0 1 auto", padding: "12px", background: "var(--t-frame)", border: "var(--t-bw) solid var(--t-card-line)", borderRadius: "28px", boxShadow: "var(--t-card-shadow)" }}><div className="zf-wd"><GuideDownload /></div></div>
        </div>
        {/* Step 2 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "32px 48px", alignItems: "center", marginTop: "88px" }}>
          <div style={{ flex: "1 1 340px", minWidth: "0" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "14px" }}>
              <span style={{ fontFamily: "var(--font-dela), sans-serif", fontSize: "56px", lineHeight: "1", color: "var(--t-hl)" }}>2</span>
              <h3 style={{ margin: "0", fontSize: "24px" }}>{t("t5")}</h3>
            </div>
            <ol style={{ margin: "14px 0 0", paddingLeft: "20px", color: "var(--t-sub)" }}>
              <li>{t.rich("li4", { b0: (c) => <b style={{ color: "var(--t-ink)" }}>{c}</b> })}</li>
              <li>{t.rich("li5", { b0: (c) => <b style={{ color: "var(--t-ink)" }}>{c}</b> })}</li>
              <li>{t.rich("li6", { b0: (c) => <b style={{ color: "var(--t-ink)" }}>{c}</b> })}</li>
              <li>{t.rich("li7", { b0: (c) => <b style={{ color: "var(--t-ink)" }}>{c}</b> })}</li>
            </ol>
            <div style={{ marginTop: "16px", padding: "14px 16px", borderRadius: "16px", background: "var(--t-card)", border: "var(--t-bw) solid var(--t-card-line)", fontSize: "14px", color: "var(--t-sub)" }}>{t.rich("div1", { b0: (c) => <b style={{ color: "var(--t-ink)" }}>{c}</b>, br: () => <br /> })}</div>
          </div>
          <div className="rv" style={{ flex: "0 1 auto", padding: "12px", background: "var(--t-frame)", border: "var(--t-bw) solid var(--t-card-line)", borderRadius: "28px", boxShadow: "var(--t-card-shadow)" }}><div className="zf-wd"><GuideIssues /></div></div>
        </div>
        {/* Step 3 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "32px 48px", alignItems: "center", marginTop: "88px" }}>
          <div style={{ flex: "1 1 340px", minWidth: "0" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "14px" }}>
              <span style={{ fontFamily: "var(--font-dela), sans-serif", fontSize: "56px", lineHeight: "1", color: "var(--t-hl)" }}>3</span>
              <h3 style={{ margin: "0", fontSize: "24px" }}>{t("t6")}</h3>
            </div>
            <ol style={{ margin: "14px 0 0", paddingLeft: "20px", color: "var(--t-sub)" }}>
              <li>{t.rich("li8", { b0: (c) => <b style={{ color: "var(--t-ink)" }}>{c}</b>, b1: (c) => <b style={{ color: "var(--t-ink)" }}>{c}</b> })}</li>
              <li>{t.rich("li9", { b0: (c) => <b style={{ color: "var(--t-ink)" }}>{c}</b> })}</li>
              <li>{t.rich("li10", { b0: (c) => <b style={{ color: "var(--t-ink)" }}>{c}</b> })}</li>
            </ol>
          </div>
          <div className="rv" style={{ flex: "0 1 auto", padding: "12px", background: "var(--t-frame)", border: "var(--t-bw) solid var(--t-card-line)", borderRadius: "28px", boxShadow: "var(--t-card-shadow)" }}><div className="zf-wd"><GuideAdd /></div></div>
        </div>
        {/* Step 4 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "32px 48px", alignItems: "center", marginTop: "88px" }}>
          <div style={{ flex: "1 1 300px", minWidth: "0" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "14px" }}>
              <span style={{ fontFamily: "var(--font-dela), sans-serif", fontSize: "56px", lineHeight: "1", color: "var(--t-hl)" }}>4</span>
              <h3 style={{ margin: "0", fontSize: "24px" }}>{t("t7")}</h3>
            </div>
            <div style={{ marginTop: "18px", display: "flex", flexDirection: "column", gap: "14px", padding: "16px 16px 16px 18px", background: "var(--t-card)", border: "var(--t-bw) solid var(--t-card-line)", borderRadius: "22px", boxShadow: "var(--t-card-shadow)" }}>
              <div>
                <div style={{ fontSize: "15px", fontWeight: "900" }}>{t("t8")}</div>
                <div aria-label={t("attr1")} style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginTop: "8px" }}>
                  <b style={{ width: "24px", height: "24px", borderRadius: "6px", background: "#06dec5", color: "#0b1520", fontSize: "12px", display: "grid", placeItems: "center" }}>W</b>
                  <b style={{ width: "24px", height: "24px", borderRadius: "6px", background: "#06dec5", color: "#0b1520", fontSize: "12px", display: "grid", placeItems: "center" }}>A</b>
                  <b style={{ width: "24px", height: "24px", borderRadius: "6px", background: "#06dec5", color: "#0b1520", fontSize: "12px", display: "grid", placeItems: "center" }}>S</b>
                  <b style={{ width: "24px", height: "24px", borderRadius: "6px", background: "#06dec5", color: "#0b1520", fontSize: "12px", display: "grid", placeItems: "center" }}>D</b>
                  <span style={{ width: "6px" }}></span>
                  <b style={{ width: "24px", height: "24px", borderRadius: "6px", background: "#4cc25a", color: "#0b1520", fontSize: "12px", display: "grid", placeItems: "center" }}>K</b>
                  <b style={{ width: "24px", height: "24px", borderRadius: "6px", background: "#f0584c", color: "#0b1520", fontSize: "12px", display: "grid", placeItems: "center" }}>L</b>
                  <b style={{ width: "24px", height: "24px", borderRadius: "6px", background: "#3b8bff", color: "#0b1520", fontSize: "12px", display: "grid", placeItems: "center" }}>J</b>
                  <b style={{ width: "24px", height: "24px", borderRadius: "6px", background: "#f2c230", color: "#0b1520", fontSize: "12px", display: "grid", placeItems: "center" }}>I</b>
                </div>
              </div>
              <CopyButton text={PRESET_MAIN} target="preset-main" labels={{ idle: t("copy.preset"), copied: t("copy.copied"), selected: t("copy.selected") }} style={{ flex: "none", minHeight: "44px", padding: "0 20px", border: "0", borderRadius: "999px", background: "#a4d007", color: "#16210a", fontFamily: "inherit", fontWeight: "900", fontSize: "15px", boxShadow: "0 4px 0 #6f8d05", cursor: "pointer" }} />
            </div>
            <ol style={{ margin: "16px 0 0", paddingLeft: "20px", color: "var(--t-sub)" }}>
              <li>{t.rich("li11", { b0: (c) => <b style={{ color: "var(--t-ink)" }}>{c}</b> })}</li>
              <li>{t.rich("li12", { b0: (c) => <b style={{ color: "var(--t-ink)" }}>{c}</b> })}</li>
              <li>{t.rich("li13", { b0: (c) => <b style={{ color: "var(--t-ink)" }}>{c}</b> })}</li>
            </ol>
          </div>
          <div className="rv" style={{ flex: "0 1 auto", padding: "12px", background: "var(--t-frame)", border: "var(--t-bw) solid var(--t-card-line)", borderRadius: "28px", boxShadow: "var(--t-card-shadow)" }}><div className="zf-wd"><GuidePaste /></div></div>
        </div>
        {/* Step 5 */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "32px 48px", alignItems: "center", marginTop: "88px" }}>
          <div style={{ flex: "1 1 340px", minWidth: "0" }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "14px" }}>
              <span style={{ fontFamily: "var(--font-dela), sans-serif", fontSize: "56px", lineHeight: "1", color: "var(--t-hl)" }}>5</span>
              <h3 style={{ margin: "0", fontSize: "24px" }}>{t("t9")}</h3>
            </div>
            <ol style={{ margin: "14px 0 0", paddingLeft: "20px", color: "var(--t-sub)" }}>
              <li>{t.rich("li14", { b0: (c) => <b style={{ color: "var(--t-ink)" }}>{c}</b> })}</li>
              <li>{t.rich("li15", { b0: (c) => <b style={{ color: "var(--t-ink)" }}>{c}</b> })}</li>
              <li>{t.rich("li16", { b0: (c) => <b style={{ color: "var(--t-ink)" }}>{c}</b>, b1: (c) => <b style={{ color: "var(--t-ink)" }}>{c}</b> })}</li>
            </ol>
            <p style={{ margin: "12px 0 0", fontSize: "14px", color: "var(--t-sub)" }}>{t("t10")}</p>
          </div>
          <div className="rv" style={{ flex: "0 1 auto", padding: "12px", background: "var(--t-frame)", border: "var(--t-bw) solid var(--t-card-line)", borderRadius: "28px", boxShadow: "var(--t-card-shadow)" }}><div className="zf-wd"><GuideCheck /></div></div>
        </div>
        {/* Key map + presets */}
        <div id="keys" style={{ paddingTop: "120px" }}>
          <div style={{ fontFamily: "var(--font-dot), monospace", fontSize: "15px", letterSpacing: "0.1em", color: "var(--t-hl)" }}>KEY MAP</div>
          <h2 style={{ margin: "6px 0 0", fontFamily: "var(--font-dela), sans-serif", fontWeight: "400", fontSize: "clamp(28px, 4vw, 48px)" }}>{t("t11")}</h2>
          <p style={{ margin: "10px 0 0", color: "var(--t-sub)" }}>{t("t12")}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", marginTop: "36px", alignItems: "flex-start" }}>
            <div className="rv" style={{ flex: "1 1 420px", minWidth: "0", background: "var(--t-card)", border: "var(--t-bw) solid var(--t-card-line)", borderRadius: "24px", padding: "24px", boxShadow: "var(--t-card-shadow)" }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "10px 16px", fontSize: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ display: "flex", gap: "4px" }}>
                    <b style={{ width: "30px", height: "30px", borderRadius: "6px", background: "#06dec5", color: "#0b1520", display: "grid", placeItems: "center" }}>W</b>
                    <b style={{ width: "30px", height: "30px", borderRadius: "6px", background: "#06dec5", color: "#0b1520", display: "grid", placeItems: "center" }}>A</b>
                    <b style={{ width: "30px", height: "30px", borderRadius: "6px", background: "#06dec5", color: "#0b1520", display: "grid", placeItems: "center" }}>S</b>
                    <b style={{ width: "30px", height: "30px", borderRadius: "6px", background: "#06dec5", color: "#0b1520", display: "grid", placeItems: "center" }}>D</b>
                  </span>
                  {t("t13")}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>{t.rich("div2", { b0: (c) => <b style={{ width: "30px", height: "30px", borderRadius: "6px", background: "#4cc25a", color: "#0b1520", display: "grid", placeItems: "center" }}>{c}</b> })}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>{t.rich("div3", { b0: (c) => <b style={{ width: "30px", height: "30px", borderRadius: "6px", background: "#f0584c", color: "#0b1520", display: "grid", placeItems: "center" }}>{c}</b> })}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>{t.rich("div4", { b0: (c) => <b style={{ width: "30px", height: "30px", borderRadius: "6px", background: "#3b8bff", color: "#0b1520", display: "grid", placeItems: "center" }}>{c}</b> })}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>{t.rich("div5", { b0: (c) => <b style={{ width: "30px", height: "30px", borderRadius: "6px", background: "#f2c230", color: "#0b1520", display: "grid", placeItems: "center" }}>{c}</b> })}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ display: "flex", gap: "4px" }}>
                    <b style={{ width: "30px", height: "30px", borderRadius: "6px", background: "var(--t-band)", border: "1px solid var(--t-card-line)", display: "grid", placeItems: "center" }}>Q</b>
                    <b style={{ width: "30px", height: "30px", borderRadius: "6px", background: "var(--t-band)", border: "1px solid var(--t-card-line)", display: "grid", placeItems: "center" }}>E</b>
                  </span>
                  LT / LB
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ display: "flex", gap: "4px" }}>
                    <b style={{ width: "30px", height: "30px", borderRadius: "6px", background: "var(--t-band)", border: "1px solid var(--t-card-line)", display: "grid", placeItems: "center" }}>U</b>
                    <b style={{ width: "30px", height: "30px", borderRadius: "6px", background: "var(--t-band)", border: "1px solid var(--t-card-line)", display: "grid", placeItems: "center" }}>O</b>
                  </span>
                  RT / RB
                </div>
              </div>
            </div>
            <div className="rv" style={{ flex: "1 1 420px", minWidth: "0", display: "flex", flexDirection: "column", gap: "14px" }}>
              <details style={{ background: "var(--t-card)", border: "var(--t-bw) solid var(--t-card-line)", borderRadius: "20px", padding: "0 18px" }}>
                <summary style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 0", fontWeight: "900", fontSize: "15px" }}>
                  <span style={{ flex: "1" }}>{t("t14")}</span>
                  <span className="faq-plus" style={{ fontSize: "22px", lineHeight: "1", color: "var(--t-hl)", transition: "transform 0.2s" }}>+</span>
                </summary>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px 14px", margin: "0 0 12px" }}>
                  <p style={{ flex: "1 1 200px", margin: "0", fontSize: "13px", color: "var(--t-sub)" }}>{t("t15")}</p>
                  <CopyButton text={PRESET_MAIN} target="preset-main" labels={{ idle: t("copy.preset"), copied: t("copy.copied"), selected: t("copy.selected") }} style={{ flex: "none", minHeight: "44px", padding: "0 20px", border: "0", borderRadius: "999px", background: "#a4d007", color: "#16210a", fontFamily: "inherit", fontWeight: "900", fontSize: "15px", boxShadow: "0 4px 0 #6f8d05", cursor: "pointer" }} />
                </div>
                <pre className="pre-dk" id="preset-main" style={{ userSelect: "all", margin: "0 0 16px", padding: "12px 14px", maxHeight: "160px", overflow: "auto", borderRadius: "12px", background: "#1b2838", color: "#c6d4df", fontFamily: "ui-monospace, monospace", fontSize: "11.5px", lineHeight: "1.6" }}>{PRESET_MAIN}</pre>
              </details>
              <details style={{ background: "var(--t-card)", border: "var(--t-bw) solid var(--t-card-line)", borderRadius: "20px", padding: "0 18px" }}>
                <summary style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 0", fontWeight: "900", fontSize: "15px" }}>
                  <span style={{ flex: "1" }}>{t("t16")}</span>
                  <span className="faq-plus" style={{ fontSize: "22px", lineHeight: "1", color: "var(--t-hl)", transition: "transform 0.2s" }}>+</span>
                </summary>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px 14px", margin: "0 0 12px" }}>
                  <p style={{ flex: "1 1 200px", margin: "0", fontSize: "13px", color: "var(--t-sub)" }}>{t("t17")}</p>
                  <CopyButton text={PRESET_OVERCOOKED} target="preset-overcooked" labels={{ idle: t("copy.short"), copied: t("copy.copied"), selected: t("copy.selected") }} style={{ flex: "none", minHeight: "44px", padding: "0 20px", border: "0", borderRadius: "999px", background: "#a4d007", color: "#16210a", fontFamily: "inherit", fontWeight: "900", fontSize: "15px", boxShadow: "0 4px 0 #6f8d05", cursor: "pointer" }} />
                </div>
                <pre className="pre-dk" id="preset-overcooked" style={{ userSelect: "all", margin: "0 0 16px", padding: "12px 14px", maxHeight: "160px", overflow: "auto", borderRadius: "12px", background: "#1b2838", color: "#c6d4df", fontFamily: "ui-monospace, monospace", fontSize: "11.5px", lineHeight: "1.6" }}>{PRESET_OVERCOOKED}</pre>
              </details>
            </div>
          </div>
        </div>
        {/* Trouble */}
        <div id="trouble" style={{ paddingTop: "120px" }}>
          <div style={{ fontFamily: "var(--font-dot), monospace", fontSize: "15px", letterSpacing: "0.1em", color: "var(--t-hl)" }}>TROUBLE</div>
          <h2 style={{ margin: "6px 0 0", fontFamily: "var(--font-dela), sans-serif", fontWeight: "400", fontSize: "clamp(28px, 4vw, 48px)" }}>{t("t18")}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 440px), 1fr))", gap: "14px 20px", marginTop: "36px", alignItems: "start" }}>
            <details open style={{ background: "var(--t-card)", border: "var(--t-bw) solid var(--t-card-line)", borderRadius: "22px", padding: "0 22px" }}>
              <summary style={{ display: "flex", alignItems: "center", gap: "14px", padding: "18px 0", fontWeight: "900", fontSize: "16px" }}>
                <span style={{ flex: "none", width: "32px", height: "32px", borderRadius: "50%", background: "var(--t-hl)", color: "#ffffff", fontFamily: "var(--font-dela), sans-serif", fontSize: "14px", display: "grid", placeItems: "center" }}>Q</span>
                <span style={{ flex: "1" }}>{t("t19")}</span>
                <span className="faq-plus" style={{ fontSize: "24px", lineHeight: "1", color: "var(--t-hl)", transition: "transform 0.2s" }}>+</span>
              </summary>
              <p style={{ margin: "0", padding: "0 0 20px 46px", color: "var(--t-sub)" }}>{t("t20")}</p>
            </details>
            <details style={{ background: "var(--t-card)", border: "var(--t-bw) solid var(--t-card-line)", borderRadius: "22px", padding: "0 22px" }}>
              <summary style={{ display: "flex", alignItems: "center", gap: "14px", padding: "18px 0", fontWeight: "900", fontSize: "16px" }}>
                <span style={{ flex: "none", width: "32px", height: "32px", borderRadius: "50%", background: "var(--t-hl)", color: "#ffffff", fontFamily: "var(--font-dela), sans-serif", fontSize: "14px", display: "grid", placeItems: "center" }}>Q</span>
                <span style={{ flex: "1" }}>{t("t21")}</span>
                <span className="faq-plus" style={{ fontSize: "24px", lineHeight: "1", color: "var(--t-hl)", transition: "transform 0.2s" }}>+</span>
              </summary>
              <p style={{ margin: "0", padding: "0 0 20px 46px", color: "var(--t-sub)" }}>{t("t22")}</p>
            </details>
            <details style={{ background: "var(--t-card)", border: "var(--t-bw) solid var(--t-card-line)", borderRadius: "22px", padding: "0 22px" }}>
              <summary style={{ display: "flex", alignItems: "center", gap: "14px", padding: "18px 0", fontWeight: "900", fontSize: "16px" }}>
                <span style={{ flex: "none", width: "32px", height: "32px", borderRadius: "50%", background: "var(--t-hl)", color: "#ffffff", fontFamily: "var(--font-dela), sans-serif", fontSize: "14px", display: "grid", placeItems: "center" }}>Q</span>
                <span style={{ flex: "1" }}>{t("t23")}</span>
                <span className="faq-plus" style={{ fontSize: "24px", lineHeight: "1", color: "var(--t-hl)", transition: "transform 0.2s" }}>+</span>
              </summary>
              <p style={{ margin: "0", padding: "0 0 20px 46px", color: "var(--t-sub)" }}>{t("t24")}</p>
            </details>
            <details style={{ background: "var(--t-card)", border: "var(--t-bw) solid var(--t-card-line)", borderRadius: "22px", padding: "0 22px" }}>
              <summary style={{ display: "flex", alignItems: "center", gap: "14px", padding: "18px 0", fontWeight: "900", fontSize: "16px" }}>
                <span style={{ flex: "none", width: "32px", height: "32px", borderRadius: "50%", background: "var(--t-hl)", color: "#ffffff", fontFamily: "var(--font-dela), sans-serif", fontSize: "14px", display: "grid", placeItems: "center" }}>Q</span>
                <span style={{ flex: "1" }}>{t("t25")}</span>
                <span className="faq-plus" style={{ fontSize: "24px", lineHeight: "1", color: "var(--t-hl)", transition: "transform 0.2s" }}>+</span>
              </summary>
              <p style={{ margin: "0", padding: "0 0 20px 46px", color: "var(--t-sub)" }}>{t("t26")}</p>
            </details>
            <details style={{ background: "var(--t-card)", border: "var(--t-bw) solid var(--t-card-line)", borderRadius: "22px", padding: "0 22px" }}>
              <summary style={{ display: "flex", alignItems: "center", gap: "14px", padding: "18px 0", fontWeight: "900", fontSize: "16px" }}>
                <span style={{ flex: "none", width: "32px", height: "32px", borderRadius: "50%", background: "var(--t-hl)", color: "#ffffff", fontFamily: "var(--font-dela), sans-serif", fontSize: "14px", display: "grid", placeItems: "center" }}>Q</span>
                <span style={{ flex: "1" }}>{t("t27")}</span>
                <span className="faq-plus" style={{ fontSize: "24px", lineHeight: "1", color: "var(--t-hl)", transition: "transform 0.2s" }}>+</span>
              </summary>
              <p style={{ margin: "0", padding: "0 0 20px 46px", color: "var(--t-sub)" }}>{t("t28")}</p>
            </details>
          </div>
        </div>
        {/* CTA */}
        <div className="rv" style={{ position: "relative", marginTop: "120px", background: "var(--t-panel)", color: "var(--t-panel-ink)", border: "var(--t-bw) solid var(--t-card-line)", borderRadius: "44px", padding: "72px 32px 64px", textAlign: "center", overflow: "hidden" }}>
          <div aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", top: "18px", fontFamily: "var(--font-dela), sans-serif", fontSize: "clamp(56px, 12vw, 160px)", lineHeight: "1", color: "rgba(255,255,255,0.06)", whiteSpace: "nowrap" }}>READY?</div>
          <h2 style={{ position: "relative", margin: "0", fontFamily: "var(--font-dela), sans-serif", fontWeight: "400", fontSize: "clamp(26px, 4vw, 46px)", lineHeight: "1.35" }}>{t.rich("h22", { br: () => <br /> })}</h2>
          <p style={{ position: "relative", margin: "14px 0 0", opacity: "0.85" }}>{t("t29")}</p>
          <div style={{ position: "relative", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "14px", marginTop: "28px" }}>
            <Link className="pill" href="/" style={{ background: "#a4d007", color: "#16210a", textDecoration: "none", fontWeight: "900", fontSize: "17px", padding: "16px 30px", borderRadius: "999px", boxShadow: "0 6px 0 #6f8d05" }}>{t("t30")}</Link>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer style={{ marginTop: "96px", background: "var(--t-foot)", color: "var(--t-foot-ink)" }}>
        <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "36px 24px", display: "flex", flexWrap: "wrap", gap: "16px 40px", alignItems: "center" }}>
          <Image src="/assets/branding/logo.png" alt="" width={36} height={36} style={{ width: "36px", height: "36px", borderRadius: "10px" }} />
          <p style={{ margin: "0", flex: "1 1 320px", fontSize: "13px" }}>{t("t31")}</p>
          <a href="https://www.x360ce.com/" style={{ color: "var(--t-foot-ink)", fontSize: "14px" }}>{t("t32")}</a>
        </div>
      </footer>
    </section>
  );
}
