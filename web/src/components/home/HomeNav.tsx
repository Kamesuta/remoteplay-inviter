import Image from "next/image";
import { useTranslations } from "next-intl";
import LanguageLink from "@/components/LanguageLink";

export default function HomeNav() {
  const t = useTranslations("home.nav");
  return (
    <header style={{ position: "sticky", top: "0", zIndex: "30", padding: "14px 16px 0" }}>
      <nav style={{ maxWidth: "1160px", margin: "0 auto", background: "var(--t-nav)", border: "var(--t-bw) solid var(--t-nav-line)", borderRadius: "28px", padding: "8px 8px 8px 18px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "8px 24px", boxShadow: "0 10px 30px rgba(0,0,0,0.12)", color: "var(--t-nav-ink)" }}>
        <a href="#top" style={{ display: "flex", alignItems: "center", gap: "10px", color: "var(--t-nav-ink)", textDecoration: "none", fontFamily: "var(--font-dela), sans-serif", fontSize: "15px", letterSpacing: "0.02em", minHeight: "44px" }}>
          <Image src="/assets/branding/logo.png" alt="" width={32} height={32} style={{ width: "32px", height: "32px", borderRadius: "9px" }} />
          REMOTE PLAY INVITER
        </a>
        <div className="nav-links" style={{ display: "flex", flexWrap: "wrap", gap: "0 22px", flex: "1 1 auto", fontSize: "14px", fontWeight: "700" }}>
          <a href="#worry" style={{ color: "var(--t-nav-ink)", textDecoration: "none", minHeight: "44px", display: "flex", alignItems: "center" }}>{t("t1")}</a>
          <a href="#features" style={{ color: "var(--t-nav-ink)", textDecoration: "none", minHeight: "44px", display: "flex", alignItems: "center" }}>{t("t2")}</a>
          <a href="#start" style={{ color: "var(--t-nav-ink)", textDecoration: "none", minHeight: "44px", display: "flex", alignItems: "center" }}>{t("t3")}</a>
          <a href="#faq" style={{ color: "var(--t-nav-ink)", textDecoration: "none", minHeight: "44px", display: "flex", alignItems: "center" }}>{t("t4")}</a>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {/* Outside nav-links so it stays on small screens */}
          <LanguageLink style={{ color: "var(--t-nav-ink)", textDecoration: "none", fontSize: "14px", fontWeight: "700", padding: "0 10px", minHeight: "44px", display: "flex", alignItems: "center" }} />
          <a className="pill" href="https://discord.com/oauth2/authorize?client_id=1252429340780527714" style={{ background: "#5865f2", color: "#ffffff", textDecoration: "none", fontWeight: "700", fontSize: "14px", padding: "0 18px", minHeight: "44px", borderRadius: "999px", display: "flex", alignItems: "center", boxShadow: "0 4px 0 #3c45a5" }}>{t("t5")}</a>
          <a className="pill" href="https://github.com/Kamesuta/remoteplay-inviter/releases/latest/download/remoteplay-inviter-windows.zip" style={{ background: "var(--t-dl)", color: "var(--t-dl-ink)", textDecoration: "none", fontWeight: "700", fontSize: "14px", padding: "0 18px", minHeight: "44px", borderRadius: "999px", display: "flex", alignItems: "center", boxShadow: "0 4px 0 var(--t-dl-shadow)" }}>{t("t6")}</a>
        </div>
      </nav>
    </header>
  );
}
