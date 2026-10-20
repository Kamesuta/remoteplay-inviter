import { useTranslations } from "next-intl";

export default function GuideReady() {
  const t = useTranslations("guide.ready");
  return (
    <section id="ready" style={{ maxWidth: "1160px", margin: "0 auto", padding: "120px 24px 0" }}>
      <div style={{ fontFamily: "var(--font-dot), monospace", fontSize: "15px", letterSpacing: "0.1em", color: "var(--t-hl)" }}>BEFORE YOU START</div>
      <h2 style={{ margin: "6px 0 0", fontFamily: "var(--font-dela), sans-serif", fontWeight: "400", fontSize: "clamp(28px, 4vw, 48px)" }}>{t("t1")}</h2>
      <div className="cols-3s" style={{ display: "grid", gap: "40px 20px", marginTop: "48px" }}>
        <div className="rv lift" style={{ position: "relative", background: "var(--t-card)", border: "var(--t-bw) solid var(--t-card-line)", borderRadius: "24px", padding: "40px 24px 24px", boxShadow: "var(--t-card-shadow)" }}>
          <span style={{ position: "absolute", left: "22px", top: "-22px", width: "46px", height: "46px", borderRadius: "50%", background: "#1a9fff", color: "#071a2e", display: "grid", placeItems: "center" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="12" rx="2"></rect>
              <path d="M8 20h8M12 16v4"></path>
            </svg>
          </span>
          <h3 style={{ margin: "0", fontSize: "19px" }}>{t("t2")}</h3>
          <p style={{ margin: "6px 0 0", fontSize: "14px", color: "var(--t-sub)" }}>{t("t3")}</p>
        </div>
        <div className="rv lift" style={{ position: "relative", background: "var(--t-card)", border: "var(--t-bw) solid var(--t-card-line)", borderRadius: "24px", padding: "40px 24px 24px", boxShadow: "var(--t-card-shadow)" }}>
          <span style={{ position: "absolute", left: "22px", top: "-22px", width: "46px", height: "46px", borderRadius: "50%", background: "#06dec5", color: "#0b1520", display: "grid", placeItems: "center" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="6" width="20" height="12" rx="2"></rect>
              <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8"></path>
            </svg>
          </span>
          <h3 style={{ margin: "0", fontSize: "19px" }}>{t("t4")}</h3>
          <p style={{ margin: "6px 0 0", fontSize: "14px", color: "var(--t-sub)" }}>{t("t5")}</p>
        </div>
        <div className="rv lift" style={{ position: "relative", background: "var(--t-card)", border: "var(--t-bw) solid var(--t-card-line)", borderRadius: "24px", padding: "40px 24px 24px", boxShadow: "var(--t-card-shadow)" }}>
          <span style={{ position: "absolute", left: "22px", top: "-22px", width: "46px", height: "46px", borderRadius: "50%", background: "#a4d007", color: "#16210a", display: "grid", placeItems: "center" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"></path></svg>
          </span>
          <h3 style={{ margin: "0", fontSize: "19px" }}>{t("t6")}</h3>
          <p style={{ margin: "6px 0 0", fontSize: "14px", color: "var(--t-sub)" }}>{t("t7")}</p>
        </div>
      </div>
    </section>
  );
}
