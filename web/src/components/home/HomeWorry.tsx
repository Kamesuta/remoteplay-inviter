import { useTranslations } from "next-intl";
import Worry from "@/components/anim/Worry";
import Compare from "@/components/anim/Compare";

export default function HomeWorry() {
  const t = useTranslations("home.worry");
  return (
    <section id="worry" style={{ maxWidth: "1160px", margin: "0 auto", padding: "128px 24px 0", textAlign: "center" }}>
      <div style={{ fontFamily: "var(--font-dot), monospace", fontSize: "15px", letterSpacing: "0.1em", color: "var(--t-hl)" }}>{t("t1")}</div>
      <h2 style={{ margin: "6px 0 0", fontFamily: "var(--font-dela), sans-serif", fontWeight: "400", fontSize: "clamp(28px, 4vw, 48px)", lineHeight: "1.35" }}>{t.rich("h21", { span0: (c) => <span style={{ color: "var(--t-hl)" }}>{c}</span> })}</h2>
      <div aria-hidden="true" style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "16px" }}>
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#06dec5" }}></span>
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#fe4d95" }}></span>
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#dcc02e" }}></span>
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#1a9fff" }}></span>
      </div>
      <div className="cols-3" style={{ display: "grid", gap: "40px 24px", marginTop: "64px" }}>
        <div className="rv" style={{ position: "relative", background: "var(--t-card)", border: "var(--t-bw) solid var(--t-card-line)", borderRadius: "28px", padding: "52px 28px 30px", boxShadow: "var(--t-card-shadow)" }}>
          <div style={{ position: "absolute", left: "50%", top: "-22px", transform: "translateX(-50%)", whiteSpace: "nowrap", background: "#06dec5", color: "#0b1520", fontWeight: "900", fontSize: "15px", padding: "8px 18px", borderRadius: "999px" }}>
            {t("t2")}
            <span style={{ position: "absolute", left: "50%", bottom: "-5px", width: "10px", height: "10px", marginLeft: "-5px", background: "#06dec5", transform: "rotate(45deg)" }}></span>
          </div>
          <div style={{ width: "84px", height: "84px", margin: "0 auto", borderRadius: "50%", background: "rgba(6,222,197,0.16)", display: "grid", placeItems: "center", color: "var(--t-ink)" }}>
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"></path>
              <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"></path>
            </svg>
          </div>
          <p style={{ margin: "18px 0 0", color: "var(--t-sub)", fontSize: "15px" }}>{t("t3")}</p>
        </div>
        <div className="rv" style={{ position: "relative", background: "var(--t-card)", border: "var(--t-bw) solid var(--t-card-line)", borderRadius: "28px", padding: "52px 28px 30px", boxShadow: "var(--t-card-shadow)" }}>
          <div style={{ position: "absolute", left: "50%", top: "-22px", transform: "translateX(-50%)", whiteSpace: "nowrap", background: "#fe4d95", color: "#0b1520", fontWeight: "900", fontSize: "15px", padding: "8px 18px", borderRadius: "999px" }}>
            {t("t4")}
            <span style={{ position: "absolute", left: "50%", bottom: "-5px", width: "10px", height: "10px", marginLeft: "-5px", background: "#fe4d95", transform: "rotate(45deg)" }}></span>
          </div>
          <div style={{ width: "84px", height: "84px", margin: "0 auto", borderRadius: "50%", background: "rgba(254,77,149,0.16)", display: "grid", placeItems: "center", color: "var(--t-ink)" }}>
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="9" cy="8" r="3.2"></circle>
              <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"></path>
              <circle cx="17" cy="9" r="2.6"></circle>
              <path d="M16 14.2c2.8.3 5 2.6 5 5.8"></path>
            </svg>
          </div>
          <p style={{ margin: "18px 0 0", color: "var(--t-sub)", fontSize: "15px" }}>{t("t5")}</p>
        </div>
        <div className="rv" style={{ position: "relative", background: "var(--t-card)", border: "var(--t-bw) solid var(--t-card-line)", borderRadius: "28px", padding: "52px 28px 30px", boxShadow: "var(--t-card-shadow)" }}>
          <div style={{ position: "absolute", left: "50%", top: "-22px", transform: "translateX(-50%)", whiteSpace: "nowrap", background: "#dcc02e", color: "#0b1520", fontWeight: "900", fontSize: "15px", padding: "8px 18px", borderRadius: "999px" }}>
            {t("t6")}
            <span style={{ position: "absolute", left: "50%", bottom: "-5px", width: "10px", height: "10px", marginLeft: "-5px", background: "#dcc02e", transform: "rotate(45deg)" }}></span>
          </div>
          <div style={{ width: "84px", height: "84px", margin: "0 auto", borderRadius: "50%", background: "rgba(220,192,46,0.2)", display: "grid", placeItems: "center", color: "var(--t-ink)" }}>
            <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V3h10l7.6 7.6a2 2 0 0 1 0 2.8z"></path>
              <circle cx="7.5" cy="7.5" r="1.5"></circle>
            </svg>
          </div>
          <p style={{ margin: "18px 0 0", color: "var(--t-sub)", fontSize: "15px" }}>{t("t7")}</p>
        </div>
      </div>
      <p style={{ margin: "64px 0 0", fontWeight: "900", fontSize: "18px" }}>{t("t8")}</p>
      <div className="rv" style={{ display: "inline-block", marginTop: "20px", padding: "12px", background: "var(--t-frame)", border: "var(--t-bw) solid var(--t-card-line)", borderRadius: "30px", boxShadow: "var(--t-card-shadow)", textAlign: "left" }}><div className="zf-cmp"><Worry /></div></div>
      <svg width="40" height="56" viewBox="0 0 40 56" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ display: "block", margin: "56px auto 0", color: "var(--t-hl)" }}><path d="M20 4v44M8 36l12 12 12-12"></path></svg>
      <h2 style={{ margin: "20px 0 0", fontFamily: "var(--font-dela), sans-serif", fontWeight: "400", fontSize: "clamp(28px, 4.4vw, 54px)", lineHeight: "1.35" }}>{t.rich("h22", { br: () => <br />, span0: (c) => <span style={{ color: "var(--t-hl)", background: "linear-gradient(transparent 64%, var(--t-mark) 64%)", padding: "0 0.06em" }}>{c}</span> })}</h2>
      <p style={{ margin: "16px auto 0", maxWidth: "34em", color: "var(--t-sub)" }}>{t("t9")}</p>
      <div className="rv" style={{ display: "inline-block", marginTop: "44px", padding: "12px", background: "var(--t-frame)", border: "var(--t-bw) solid var(--t-card-line)", borderRadius: "30px", boxShadow: "var(--t-card-shadow)", textAlign: "left" }}><div className="zf-cmp"><Compare /></div></div>
      <p style={{ margin: "72px 0 0", fontWeight: "900", fontSize: "18px" }}>{t("t10")}</p>
      <figure className="rv" style={{ margin: "20px auto 0", maxWidth: "760px", padding: "12px", background: "var(--t-frame)", border: "var(--t-bw) solid var(--t-card-line)", borderRadius: "30px", boxShadow: "var(--t-card-shadow)" }}>
        <video src="/assets/howto/invitation-demo.mp4" autoPlay muted loop playsInline controls preload="metadata" aria-label={t("attr1")} style={{ display: "block", width: "100%", aspectRatio: "808 / 688", borderRadius: "20px", background: "#111d2c" }}></video>
        <figcaption style={{ margin: "12px 4px 2px", display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: "8px 12px", fontSize: "14px", color: "var(--t-sub)" }}>{t.rich("figcaption1", { span0: (c) => <span style={{ background: "#1a9fff", color: "#071a2e", fontWeight: "900", fontSize: "12px", padding: "2px 10px", borderRadius: "999px" }}>{c}</span> })}</figcaption>
      </figure>
    </section>
  );
}
