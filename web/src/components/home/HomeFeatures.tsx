import { useTranslations } from "next-intl";
import Phone from "@/components/anim/Phone";

export default function HomeFeatures() {
  const t = useTranslations("home.features");
  return (
    <section id="features" style={{ maxWidth: "1160px", margin: "0 auto", padding: "136px 24px 0" }}>
      <div style={{ fontFamily: "var(--font-dot), monospace", fontSize: "15px", letterSpacing: "0.1em", color: "var(--t-hl)" }}>FEATURES</div>
      <h2 style={{ margin: "6px 0 0", fontFamily: "var(--font-dela), sans-serif", fontWeight: "400", fontSize: "clamp(28px, 4vw, 48px)", lineHeight: "1.35" }}>{t.rich("h21", { span0: (c) => <span style={{ color: "var(--t-hl)", background: "linear-gradient(transparent 64%, var(--t-mark) 64%)", padding: "0 0.06em" }}>{c}</span> })}</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "24px", marginTop: "48px", alignItems: "stretch" }}>
        <div className="rv" style={{ flex: "1 1 440px", minWidth: "0", background: "var(--t-panel)", color: "var(--t-panel-ink)", border: "var(--t-bw) solid var(--t-card-line)", borderRadius: "32px", padding: "32px", boxShadow: "var(--t-card-shadow)", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: "18px" }}>
          <div>
            <div style={{ display: "inline-block", background: "#06dec5", color: "#0b1520", fontWeight: "900", fontSize: "13px", padding: "4px 14px", borderRadius: "999px" }}>{t("t1")}</div>
            <h3 style={{ margin: "12px 0 0", fontFamily: "var(--font-dela), sans-serif", fontWeight: "400", fontSize: "28px", lineHeight: "1.35" }}>{t("t2")}</h3>
            <p style={{ margin: "10px 0 0", fontSize: "15px", opacity: "0.85" }}>{t("t3")}</p>
          </div>
          <div className="zf-phn"><Phone /></div>
        </div>
        <div style={{ flex: "999 1 520px", minWidth: "0", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "40px 20px", paddingTop: "22px" }}>
          <div className="rv lift" style={{ position: "relative", background: "var(--t-card)", border: "var(--t-bw) solid var(--t-card-line)", borderRadius: "24px", padding: "40px 24px 24px", boxShadow: "var(--t-card-shadow)" }}>
            <span style={{ position: "absolute", left: "22px", top: "-22px", width: "46px", height: "46px", borderRadius: "50%", background: "#06dec5", color: "#0b1520", fontFamily: "var(--font-dela), sans-serif", fontSize: "16px", display: "grid", placeItems: "center" }}>01</span>
            <span style={{ position: "absolute", left: "39px", top: "20px", width: "12px", height: "12px", background: "#06dec5", transform: "rotate(45deg)" }}></span>
            <h3 style={{ margin: "0", fontSize: "19px" }}>{t("t4")}</h3>
            <p style={{ margin: "6px 0 0", fontSize: "14px", color: "var(--t-sub)" }}>{t("t5")}</p>
          </div>
          <div className="rv lift" style={{ position: "relative", background: "var(--t-card)", border: "var(--t-bw) solid var(--t-card-line)", borderRadius: "24px", padding: "40px 24px 24px", boxShadow: "var(--t-card-shadow)" }}>
            <span style={{ position: "absolute", left: "22px", top: "-22px", width: "46px", height: "46px", borderRadius: "50%", background: "#fe4d95", color: "#0b1520", fontFamily: "var(--font-dela), sans-serif", fontSize: "16px", display: "grid", placeItems: "center" }}>02</span>
            <span style={{ position: "absolute", left: "39px", top: "20px", width: "12px", height: "12px", background: "#fe4d95", transform: "rotate(45deg)" }}></span>
            <h3 style={{ margin: "0", fontSize: "19px" }}>{t("t6")}</h3>
            <p style={{ margin: "6px 0 0", fontSize: "14px", color: "var(--t-sub)" }}>{t("t7")}</p>
          </div>
          <div className="rv lift" style={{ position: "relative", background: "var(--t-card)", border: "var(--t-bw) solid var(--t-card-line)", borderRadius: "24px", padding: "40px 24px 24px", boxShadow: "var(--t-card-shadow)" }}>
            <span style={{ position: "absolute", left: "22px", top: "-22px", width: "46px", height: "46px", borderRadius: "50%", background: "#dcc02e", color: "#0b1520", fontFamily: "var(--font-dela), sans-serif", fontSize: "16px", display: "grid", placeItems: "center" }}>03</span>
            <span style={{ position: "absolute", left: "39px", top: "20px", width: "12px", height: "12px", background: "#dcc02e", transform: "rotate(45deg)" }}></span>
            <h3 style={{ margin: "0", fontSize: "19px" }}>{t("t8")}</h3>
            <p style={{ margin: "6px 0 0", fontSize: "14px", color: "var(--t-sub)" }}>{t("t9")}</p>
          </div>
          <div className="rv lift" style={{ position: "relative", background: "var(--t-card)", border: "var(--t-bw) solid var(--t-card-line)", borderRadius: "24px", padding: "40px 24px 24px", boxShadow: "var(--t-card-shadow)" }}>
            <span style={{ position: "absolute", left: "22px", top: "-22px", width: "46px", height: "46px", borderRadius: "50%", background: "#1a9fff", color: "#071a2e", fontFamily: "var(--font-dela), sans-serif", fontSize: "16px", display: "grid", placeItems: "center" }}>04</span>
            <span style={{ position: "absolute", left: "39px", top: "20px", width: "12px", height: "12px", background: "#1a9fff", transform: "rotate(45deg)" }}></span>
            <h3 style={{ margin: "0", fontSize: "19px" }}>{t("t10")}</h3>
            <p style={{ margin: "6px 0 0", fontSize: "14px", color: "var(--t-sub)" }}>{t("t11")}</p>
          </div>
          <div className="rv lift" style={{ gridColumn: "1 / -1", position: "relative", background: "var(--t-card)", border: "var(--t-bw) solid var(--t-card-line)", borderRadius: "24px", padding: "40px 24px 24px", boxShadow: "var(--t-card-shadow)", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px 24px" }}>
            <span style={{ position: "absolute", left: "22px", top: "-22px", width: "46px", height: "46px", borderRadius: "50%", background: "#a4d007", color: "#16210a", fontFamily: "var(--font-dela), sans-serif", fontSize: "16px", display: "grid", placeItems: "center" }}>05</span>
            <span style={{ position: "absolute", left: "39px", top: "20px", width: "12px", height: "12px", background: "#a4d007", transform: "rotate(45deg)" }}></span>
            <div style={{ flex: "1 1 280px", minWidth: "0" }}>
              <h3 style={{ margin: "0", fontSize: "19px" }}>{t("t12")}</h3>
              <p style={{ margin: "6px 0 0", fontSize: "14px", color: "var(--t-sub)" }}>{t("t13")}</p>
            </div>
            <a className="pill" href="https://github.com/Kamesuta/remoteplay-inviter" style={{ background: "var(--t-panel)", color: "var(--t-panel-ink)", textDecoration: "none", fontWeight: "700", fontSize: "14px", padding: "0 20px", minHeight: "44px", borderRadius: "999px", display: "flex", alignItems: "center" }}>{t("t14")}</a>
          </div>
        </div>
      </div>
    </section>
  );
}
