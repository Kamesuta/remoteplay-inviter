import { useTranslations } from "next-intl";

export default function GuideWhen() {
  const t = useTranslations("guide.when");
  return (
    <section style={{ maxWidth: "1160px", margin: "0 auto", padding: "120px 24px 0", textAlign: "center" }}>
      <h2 style={{ margin: "0", fontFamily: "var(--font-dela), sans-serif", fontWeight: "400", fontSize: "clamp(28px, 4vw, 48px)", lineHeight: "1.35" }}>{t.rich("h21", { span0: (c) => <span style={{ color: "var(--t-hl)" }}>{c}</span> })}</h2>
      <div className="cols-3" style={{ display: "grid", gap: "40px 24px", marginTop: "60px" }}>
        <div className="rv" style={{ position: "relative", background: "var(--t-card)", border: "var(--t-bw) solid var(--t-card-line)", borderRadius: "28px", padding: "52px 28px 30px", boxShadow: "var(--t-card-shadow)" }}>
          <div style={{ position: "absolute", left: "50%", top: "-22px", transform: "translateX(-50%)", whiteSpace: "nowrap", background: "#06dec5", color: "#0b1520", fontWeight: "900", fontSize: "15px", padding: "8px 18px", borderRadius: "999px" }}>
            {t("t1")}
            <span style={{ position: "absolute", left: "50%", bottom: "-5px", width: "10px", height: "10px", marginLeft: "-5px", background: "#06dec5", transform: "rotate(45deg)" }}></span>
          </div>
          <p style={{ margin: "0", color: "var(--t-sub)", fontSize: "15px" }}>{t("t2")}</p>
        </div>
        <div className="rv" style={{ position: "relative", background: "var(--t-card)", border: "var(--t-bw) solid var(--t-card-line)", borderRadius: "28px", padding: "52px 28px 30px", boxShadow: "var(--t-card-shadow)" }}>
          <div style={{ position: "absolute", left: "50%", top: "-22px", transform: "translateX(-50%)", whiteSpace: "nowrap", background: "#fe4d95", color: "#0b1520", fontWeight: "900", fontSize: "15px", padding: "8px 18px", borderRadius: "999px" }}>
            {t("t3")}
            <span style={{ position: "absolute", left: "50%", bottom: "-5px", width: "10px", height: "10px", marginLeft: "-5px", background: "#fe4d95", transform: "rotate(45deg)" }}></span>
          </div>
          <p style={{ margin: "0", color: "var(--t-sub)", fontSize: "15px" }}>{t("t4")}</p>
        </div>
        <div className="rv" style={{ position: "relative", background: "var(--t-card)", border: "var(--t-bw) solid var(--t-card-line)", borderRadius: "28px", padding: "52px 28px 30px", boxShadow: "var(--t-card-shadow)" }}>
          <div style={{ position: "absolute", left: "50%", top: "-22px", transform: "translateX(-50%)", whiteSpace: "nowrap", background: "#dcc02e", color: "#0b1520", fontWeight: "900", fontSize: "15px", padding: "8px 18px", borderRadius: "999px" }}>
            {t("t5")}
            <span style={{ position: "absolute", left: "50%", bottom: "-5px", width: "10px", height: "10px", marginLeft: "-5px", background: "#dcc02e", transform: "rotate(45deg)" }}></span>
          </div>
          <p style={{ margin: "0", color: "var(--t-sub)", fontSize: "15px" }}>{t("t6")}</p>
        </div>
      </div>
    </section>
  );
}
