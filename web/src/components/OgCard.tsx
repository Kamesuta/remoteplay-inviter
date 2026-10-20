import Image from "next/image";
import { useTranslations } from "next-intl";

// The 1200x630 card shared on social media; recorded into public/assets/branding/og-image-<locale>.png
const BUDDIES = [
  { label: "1P", color: "#e58a3a", w: 78, h: 69 },
  { label: "2P", color: "#06dec5", w: 66, h: 60 },
  { label: "3P", color: "#fe4d95", w: 70, h: 63 },
  { label: "4P", color: "#dcc02e", w: 63, h: 57 },
];

export default function OgCard() {
  const t = useTranslations("home.hero");
  return (
    <div
      style={{
        position: "relative",
        width: 1200,
        height: 630,
        overflow: "hidden",
        backgroundColor: "var(--t-bg)",
        backgroundImage: "linear-gradient(var(--t-grid) 1px, transparent 1px), linear-gradient(90deg, var(--t-grid) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
        color: "var(--t-ink)",
        fontFamily: "var(--font-zen), 'Hiragino Sans', sans-serif",
      }}
    >
      <div style={{ position: "absolute", left: 0, right: 0, bottom: -40, textAlign: "center", fontFamily: "var(--font-dela), sans-serif", fontSize: 190, lineHeight: 1, color: "var(--t-word)", whiteSpace: "nowrap" }}>PLAY TOGETHER</div>
      <div style={{ position: "absolute", left: 72, top: 60, display: "flex", alignItems: "center", gap: 16, fontFamily: "var(--font-dela), sans-serif", fontSize: 28, letterSpacing: "0.02em", color: "var(--t-nav-ink)" }}>
        <Image src="/assets/branding/logo.png" alt="" width={56} height={56} style={{ borderRadius: 14 }} />
        REMOTE PLAY INVITER
      </div>
      <div style={{ position: "absolute", left: 72, top: 172, display: "inline-block", background: "var(--t-tag)", color: "var(--t-tag-ink)", fontWeight: 900, fontSize: 24, padding: "8px 24px", borderRadius: 999 }}>{t("t1")}</div>
      <h1 style={{ position: "absolute", left: 72, top: 238, margin: 0, fontFamily: "var(--font-dela), sans-serif", fontWeight: 400, fontSize: 76, lineHeight: 1.3 }}>
        {t.rich("h11", {
          br: () => <br />,
          span0: (c) => <span style={{ color: "var(--t-hl)", background: "linear-gradient(transparent 64%, var(--t-mark) 64%)", padding: "0 0.06em" }}>{c}</span>,
        })}
      </h1>
      <div style={{ position: "absolute", left: 76, top: 470, display: "flex", gap: 10 }}>
        {["#06dec5", "#fe4d95", "#dcc02e", "#1a9fff"].map((c) => (
          <span key={c} style={{ width: 14, height: 14, borderRadius: "50%", background: c }} />
        ))}
      </div>
      <div style={{ position: "absolute", right: 72, top: 40, display: "flex", gap: 18, alignItems: "flex-end" }}>
        {BUDDIES.map((b) => (
          <div key={b.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <span style={{ fontFamily: "var(--font-dot), monospace", fontSize: 18, lineHeight: 1.5, background: "var(--t-panel)", color: "#ffffff", padding: "0 12px", borderRadius: 8 }}>{b.label}</span>
            <span style={{ position: "relative", display: "block", width: b.w, height: b.h, background: b.color, borderRadius: "50% 50% 42% 42%" }}>
              <i style={{ position: "absolute", left: b.w * 0.27, top: b.h * 0.35, width: b.w * 0.13, height: b.h * 0.22, borderRadius: 5, background: "#10202e" }} />
              <i style={{ position: "absolute", right: b.w * 0.27, top: b.h * 0.35, width: b.w * 0.13, height: b.h * 0.22, borderRadius: 5, background: "#10202e" }} />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
