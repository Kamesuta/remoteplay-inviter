import { useTranslations } from "next-intl";
import InviteFlow from "@/components/anim/InviteFlow";

export default function HomeHero() {
  const t = useTranslations("home.hero");
  return (
    <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "72px 24px 0", textAlign: "center" }}>
      <div style={{ position: "relative", display: "inline-block", background: "var(--t-tag)", color: "var(--t-tag-ink)", fontWeight: "900", fontSize: "15px", padding: "8px 20px", borderRadius: "999px" }}>
        {t("t1")}
        <span style={{ position: "absolute", left: "50%", bottom: "-6px", width: "12px", height: "12px", marginLeft: "-6px", background: "var(--t-tag)", transform: "rotate(45deg)" }}></span>
      </div>
      <h1 style={{ margin: "28px 0 0", fontFamily: "var(--font-dela), sans-serif", fontWeight: "400", fontSize: "clamp(27px, 6.2vw, 84px)", lineHeight: "1.3", letterSpacing: "0.01em" }}>{t.rich("h11", { br: () => <br />, span0: (c) => <span style={{ color: "var(--t-hl)", background: "linear-gradient(transparent 64%, var(--t-mark) 64%)", padding: "0 0.06em" }}>{c}</span> })}</h1>
      <div aria-hidden="true" style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "22px" }}>
        <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#06dec5" }}></span>
        <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#fe4d95" }}></span>
        <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#dcc02e" }}></span>
        <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#1a9fff" }}></span>
      </div>
      <p style={{ margin: "20px auto 0", fontSize: "18px", color: "var(--t-sub)", maxWidth: "34em" }}>{t.rich("p1", { b0: (c) => <b style={{ color: "var(--t-ink)" }}>{c}</b> })}</p>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "14px", marginTop: "32px" }}>
        <a className="pill" href="https://discord.com/oauth2/authorize?client_id=1252429340780527714" style={{ display: "flex", alignItems: "center", gap: "10px", background: "#5865f2", color: "#ffffff", textDecoration: "none", fontWeight: "900", fontSize: "17px", padding: "16px 30px", borderRadius: "999px", boxShadow: "0 6px 0 #3c45a5" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14"></path></svg>
          {t("t2")}
        </a>
        <a className="pill" href="https://github.com/Kamesuta/remoteplay-inviter/releases/latest/download/remoteplay-inviter-windows.zip" style={{ display: "flex", alignItems: "center", gap: "10px", background: "var(--t-dl)", color: "var(--t-dl-ink)", textDecoration: "none", fontWeight: "900", fontSize: "17px", padding: "16px 30px", borderRadius: "999px", boxShadow: "0 6px 0 var(--t-dl-shadow)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"></path></svg>
          {t("t3")}
        </a>
      </div>
      <p style={{ margin: "18px 0 0", fontSize: "14px", color: "var(--t-sub)" }}>{t.rich("p2", { a0: (c) => <a href="https://github.com/Kamesuta/remoteplay-inviter/releases/latest" style={{ color: "var(--t-hl)" }}>{c}</a> })}</p>
      <div aria-hidden="true" style={{ display: "flex", justifyContent: "center", marginTop: "48px", fontFamily: "var(--font-dela), sans-serif", fontSize: "clamp(48px, 9.6vw, 140px)", lineHeight: "1", color: "var(--t-word)", whiteSpace: "nowrap", letterSpacing: "0.02em" }}>PLAY TOGETHER</div>
      <div style={{ position: "relative", display: "inline-block", marginTop: "-0.45em", fontSize: "clamp(48px, 9.6vw, 140px)", verticalAlign: "top" }}>
        <div className="buddies" aria-hidden="true" style={{ position: "absolute", right: "56px", top: "-68px", display: "flex", gap: "12px", alignItems: "flex-end", fontSize: "16px" }}>
          <div className="bob" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
            <span style={{ fontFamily: "var(--font-dot), monospace", fontSize: "12px", lineHeight: "1.5", background: "var(--t-panel)", color: "#ffffff", padding: "0 8px", borderRadius: "6px" }}>1P</span>
            <span style={{ position: "relative", display: "block", width: "52px", height: "46px", background: "#e58a3a", borderRadius: "50% 50% 42% 42%" }}>
              <i style={{ position: "absolute", left: "14px", top: "16px", width: "7px", height: "10px", borderRadius: "4px", background: "#10202e" }}></i>
              <i style={{ position: "absolute", right: "14px", top: "16px", width: "7px", height: "10px", borderRadius: "4px", background: "#10202e" }}></i>
            </span>
          </div>
          <div className="bob" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", animationDelay: "0.3s" }}>
            <span style={{ fontFamily: "var(--font-dot), monospace", fontSize: "12px", lineHeight: "1.5", background: "var(--t-panel)", color: "#ffffff", padding: "0 8px", borderRadius: "6px" }}>2P</span>
            <span style={{ position: "relative", display: "block", width: "44px", height: "40px", background: "#06dec5", borderRadius: "50% 50% 42% 42%" }}>
              <i style={{ position: "absolute", left: "12px", top: "14px", width: "6px", height: "9px", borderRadius: "3px", background: "#10202e" }}></i>
              <i style={{ position: "absolute", right: "12px", top: "14px", width: "6px", height: "9px", borderRadius: "3px", background: "#10202e" }}></i>
            </span>
          </div>
          <div className="bob" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", animationDelay: "0.6s" }}>
            <span style={{ fontFamily: "var(--font-dot), monospace", fontSize: "12px", lineHeight: "1.5", background: "var(--t-panel)", color: "#ffffff", padding: "0 8px", borderRadius: "6px" }}>3P</span>
            <span style={{ position: "relative", display: "block", width: "48px", height: "42px", background: "#fe4d95", borderRadius: "50% 50% 42% 42%" }}>
              <i style={{ position: "absolute", left: "13px", top: "15px", width: "6px", height: "9px", borderRadius: "3px", background: "#10202e" }}></i>
              <i style={{ position: "absolute", right: "13px", top: "15px", width: "6px", height: "9px", borderRadius: "3px", background: "#10202e" }}></i>
            </span>
          </div>
          <div className="bob" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", animationDelay: "0.9s" }}>
            <span style={{ fontFamily: "var(--font-dot), monospace", fontSize: "12px", lineHeight: "1.5", background: "var(--t-panel)", color: "#ffffff", padding: "0 8px", borderRadius: "6px" }}>4P</span>
            <span style={{ position: "relative", display: "block", width: "42px", height: "38px", background: "#dcc02e", borderRadius: "50% 50% 42% 42%" }}>
              <i style={{ position: "absolute", left: "11px", top: "13px", width: "6px", height: "9px", borderRadius: "3px", background: "#10202e" }}></i>
              <i style={{ position: "absolute", right: "11px", top: "13px", width: "6px", height: "9px", borderRadius: "3px", background: "#10202e" }}></i>
            </span>
          </div>
        </div>
        <div style={{ padding: "14px", background: "var(--t-frame)", border: "var(--t-bw) solid var(--t-card-line)", borderRadius: "34px", boxShadow: "var(--t-card-shadow)", fontSize: "16px", textAlign: "left" }}><div className="zf-hero"><InviteFlow /></div></div>
      </div>
    </section>
  );
}
