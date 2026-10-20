import { useTranslations } from "next-intl";
import KeyMap from "@/components/anim/KeyMap";

export default function GuideHero() {
  const t = useTranslations("guide.hero");
  return (
    <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "64px 24px 0", textAlign: "center" }}>
      <div style={{ position: "relative", display: "inline-block", background: "var(--t-tag)", color: "var(--t-tag-ink)", fontWeight: "900", fontSize: "15px", padding: "8px 20px", borderRadius: "999px" }}>
        {t("t1")}
        <span style={{ position: "absolute", left: "50%", bottom: "-6px", width: "12px", height: "12px", marginLeft: "-6px", background: "var(--t-tag)", transform: "rotate(45deg)" }}></span>
      </div>
      <h1 style={{ margin: "28px 0 0", fontFamily: "var(--font-dela), sans-serif", fontWeight: "400", fontSize: "clamp(27px, 6vw, 80px)", lineHeight: "1.3" }}>{t.rich("h11", { br: () => <br />, span0: (c) => <span style={{ color: "var(--t-hl)", background: "linear-gradient(transparent 64%, var(--t-mark) 64%)", padding: "0 0.06em" }}>{c}</span> })}</h1>
      <div aria-hidden="true" style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "22px" }}>
        <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#06dec5" }}></span>
        <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#fe4d95" }}></span>
        <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#dcc02e" }}></span>
        <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#1a9fff" }}></span>
      </div>
      <p style={{ margin: "20px auto 0", fontSize: "18px", color: "var(--t-sub)", maxWidth: "34em" }}>{t.rich("p1", { b0: (c) => <b style={{ color: "var(--t-ink)" }}>{c}</b> })}</p>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "14px", marginTop: "30px" }}>
        <a className="pill" href="#steps" style={{ display: "flex", alignItems: "center", gap: "10px", background: "var(--t-dl)", color: "var(--t-dl-ink)", textDecoration: "none", fontWeight: "900", fontSize: "17px", padding: "16px 30px", borderRadius: "999px", boxShadow: "0 6px 0 var(--t-dl-shadow)" }}>{t("t2")}</a>
        <a className="pill" href="https://www.x360ce.com/" style={{ display: "flex", alignItems: "center", gap: "10px", background: "var(--t-card)", color: "var(--t-ink)", border: "var(--t-bw) solid var(--t-card-line)", textDecoration: "none", fontWeight: "900", fontSize: "17px", padding: "15px 28px", borderRadius: "999px", boxShadow: "0 6px 0 var(--t-card-line)" }}>{t("t3")}</a>
      </div>
      <div className="rv" style={{ display: "inline-block", marginTop: "48px", padding: "12px", background: "var(--t-frame)", border: "var(--t-bw) solid var(--t-card-line)", borderRadius: "30px", boxShadow: "var(--t-card-shadow)", textAlign: "left" }}><div className="zf-kmp"><KeyMap /></div></div>
    </section>
  );
}
