import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Setup from "@/components/anim/Setup";

export default function HomeStart() {
  const t = useTranslations("home.start");
  return (
    <section id="start" style={{ marginTop: "136px", background: "var(--t-band)", borderRadius: "56px 56px 0 0", borderTop: "var(--t-bw) solid var(--t-card-line)" }}>
      <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "96px 24px 0" }}>
        <div style={{ fontFamily: "var(--font-dot), monospace", fontSize: "15px", letterSpacing: "0.1em", color: "var(--t-hl)" }}>HOW TO START</div>
        <h2 style={{ margin: "6px 0 0", fontFamily: "var(--font-dela), sans-serif", fontWeight: "400", fontSize: "clamp(28px, 4vw, 48px)", lineHeight: "1.35" }}>{t.rich("h21", { span0: (c) => <span style={{ color: "var(--t-hl)", background: "linear-gradient(transparent 64%, var(--t-mark) 64%)", padding: "0 0.06em" }}>{c}</span> })}</h2>
        <p style={{ margin: "10px 0 0", color: "var(--t-sub)" }}>{t("t1")}</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "40px", marginTop: "48px", alignItems: "center" }}>
          <div className="rv" style={{ flex: "0 1 auto", minWidth: "0", padding: "12px", background: "var(--t-frame)", border: "var(--t-bw) solid var(--t-card-line)", borderRadius: "30px", boxShadow: "var(--t-card-shadow)" }}><div className="zf-stp"><Setup /></div></div>
          <ol style={{ flex: "1 1 340px", minWidth: "0", margin: "0", padding: "0", listStyle: "none", display: "flex", flexDirection: "column", gap: "28px" }}>
            <li className="rv" style={{ display: "flex", gap: "18px", alignItems: "flex-start" }}>
              <span style={{ flex: "none", fontFamily: "var(--font-dela), sans-serif", fontSize: "56px", lineHeight: "1", color: "var(--t-hl)" }}>1</span>
              <div>
                <h3 style={{ margin: "4px 0 0", fontSize: "20px" }}>{t("t2")}</h3>
                <p style={{ margin: "4px 0 0", fontSize: "15px", color: "var(--t-sub)" }}>{t("t3")}</p>
                <a className="pill" href="https://discord.com/oauth2/authorize?client_id=1252429340780527714" style={{ display: "inline-flex", alignItems: "center", marginTop: "12px", background: "#5865f2", color: "#ffffff", textDecoration: "none", fontWeight: "700", fontSize: "14px", padding: "0 18px", minHeight: "44px", borderRadius: "999px", boxShadow: "0 4px 0 #3c45a5" }}>{t("t4")}</a>
              </div>
            </li>
            <li className="rv" style={{ display: "flex", gap: "18px", alignItems: "flex-start" }}>
              <span style={{ flex: "none", fontFamily: "var(--font-dela), sans-serif", fontSize: "56px", lineHeight: "1", color: "var(--t-hl)" }}>2</span>
              <div>
                <h3 style={{ margin: "4px 0 0", fontSize: "20px" }}>{t("t5")}</h3>
                <p style={{ margin: "4px 0 0", fontSize: "15px", color: "var(--t-sub)" }}>{t("t6")}</p>
                <a className="pill" href="https://github.com/Kamesuta/remoteplay-inviter/releases/latest/download/remoteplay-inviter-windows.zip" style={{ display: "inline-flex", alignItems: "center", marginTop: "12px", background: "var(--t-dl)", color: "var(--t-dl-ink)", textDecoration: "none", fontWeight: "700", fontSize: "14px", padding: "0 18px", minHeight: "44px", borderRadius: "999px", boxShadow: "0 4px 0 var(--t-dl-shadow)" }}>{t("t7")}</a>
              </div>
            </li>
            <li className="rv" style={{ display: "flex", gap: "18px", alignItems: "flex-start" }}>
              <span style={{ flex: "none", fontFamily: "var(--font-dela), sans-serif", fontSize: "56px", lineHeight: "1", color: "var(--t-hl)" }}>3</span>
              <div>
                <h3 style={{ margin: "4px 0 0", fontSize: "20px" }}>{t("t8")}</h3>
                <p style={{ margin: "4px 0 0", fontSize: "15px", color: "var(--t-sub)" }}>{t.rich("p1", { code0: (c) => <code style={{ fontWeight: "700", color: "var(--t-ink)" }}>{c}</code> })}</p>
              </div>
            </li>
          </ol>
        </div>
        {/* FAQ */}
        <div id="faq" style={{ padding: "120px 0 0" }}>
          <div style={{ fontFamily: "var(--font-dot), monospace", fontSize: "15px", letterSpacing: "0.1em", color: "var(--t-hl)" }}>FAQ</div>
          <h2 style={{ margin: "6px 0 0", fontFamily: "var(--font-dela), sans-serif", fontWeight: "400", fontSize: "clamp(28px, 4vw, 48px)" }}>{t("t9")}</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 440px), 1fr))", gap: "14px 20px", marginTop: "36px", alignItems: "start" }}>
            <details open style={{ background: "var(--t-card)", border: "var(--t-bw) solid var(--t-card-line)", borderRadius: "22px", padding: "0 22px" }}>
              <summary style={{ display: "flex", alignItems: "center", gap: "14px", padding: "18px 0", fontWeight: "900", fontSize: "16px" }}>
                <span style={{ flex: "none", width: "32px", height: "32px", borderRadius: "50%", background: "var(--t-hl)", color: "#ffffff", fontFamily: "var(--font-dela), sans-serif", fontSize: "14px", display: "grid", placeItems: "center" }}>Q</span>
                <span style={{ flex: "1" }}>{t("t10")}</span>
                <span className="faq-plus" style={{ fontSize: "24px", lineHeight: "1", color: "var(--t-hl)", transition: "transform 0.2s" }}>+</span>
              </summary>
              <p style={{ margin: "0", padding: "0 0 20px 46px", color: "var(--t-sub)" }}>{t("t11")}</p>
            </details>
            <details style={{ background: "var(--t-card)", border: "var(--t-bw) solid var(--t-card-line)", borderRadius: "22px", padding: "0 22px" }}>
              <summary style={{ display: "flex", alignItems: "center", gap: "14px", padding: "18px 0", fontWeight: "900", fontSize: "16px" }}>
                <span style={{ flex: "none", width: "32px", height: "32px", borderRadius: "50%", background: "var(--t-hl)", color: "#ffffff", fontFamily: "var(--font-dela), sans-serif", fontSize: "14px", display: "grid", placeItems: "center" }}>Q</span>
                <span style={{ flex: "1" }}>{t("t12")}</span>
                <span className="faq-plus" style={{ fontSize: "24px", lineHeight: "1", color: "var(--t-hl)", transition: "transform 0.2s" }}>+</span>
              </summary>
              <p style={{ margin: "0", padding: "0 0 20px 46px", color: "var(--t-sub)" }}>{t("t13")}</p>
            </details>
            <details style={{ background: "var(--t-card)", border: "var(--t-bw) solid var(--t-card-line)", borderRadius: "22px", padding: "0 22px" }}>
              <summary style={{ display: "flex", alignItems: "center", gap: "14px", padding: "18px 0", fontWeight: "900", fontSize: "16px" }}>
                <span style={{ flex: "none", width: "32px", height: "32px", borderRadius: "50%", background: "var(--t-hl)", color: "#ffffff", fontFamily: "var(--font-dela), sans-serif", fontSize: "14px", display: "grid", placeItems: "center" }}>Q</span>
                <span style={{ flex: "1" }}>{t("t14")}</span>
                <span className="faq-plus" style={{ fontSize: "24px", lineHeight: "1", color: "var(--t-hl)", transition: "transform 0.2s" }}>+</span>
              </summary>
              <p style={{ margin: "0", padding: "0 0 20px 46px", color: "var(--t-sub)" }}>{t("t15")}</p>
            </details>
            <details style={{ background: "var(--t-card)", border: "var(--t-bw) solid var(--t-card-line)", borderRadius: "22px", padding: "0 22px" }}>
              <summary style={{ display: "flex", alignItems: "center", gap: "14px", padding: "18px 0", fontWeight: "900", fontSize: "16px" }}>
                <span style={{ flex: "none", width: "32px", height: "32px", borderRadius: "50%", background: "var(--t-hl)", color: "#ffffff", fontFamily: "var(--font-dela), sans-serif", fontSize: "14px", display: "grid", placeItems: "center" }}>Q</span>
                <span style={{ flex: "1" }}>{t("t16")}</span>
                <span className="faq-plus" style={{ fontSize: "24px", lineHeight: "1", color: "var(--t-hl)", transition: "transform 0.2s" }}>+</span>
              </summary>
              <p style={{ margin: "0", padding: "0 0 20px 46px", color: "var(--t-sub)" }}>{t("t17")}</p>
            </details>
            <details style={{ background: "var(--t-card)", border: "var(--t-bw) solid var(--t-card-line)", borderRadius: "22px", padding: "0 22px" }}>
              <summary style={{ display: "flex", alignItems: "center", gap: "14px", padding: "18px 0", fontWeight: "900", fontSize: "16px" }}>
                <span style={{ flex: "none", width: "32px", height: "32px", borderRadius: "50%", background: "var(--t-hl)", color: "#ffffff", fontFamily: "var(--font-dela), sans-serif", fontSize: "14px", display: "grid", placeItems: "center" }}>Q</span>
                <span style={{ flex: "1" }}>{t("t18")}</span>
                <span className="faq-plus" style={{ fontSize: "24px", lineHeight: "1", color: "var(--t-hl)", transition: "transform 0.2s" }}>+</span>
              </summary>
              <p style={{ margin: "0", padding: "0 0 20px 46px", color: "var(--t-sub)" }}>{t("t19")}</p>
            </details>
            <details style={{ background: "var(--t-card)", border: "var(--t-bw) solid var(--t-card-line)", borderRadius: "22px", padding: "0 22px" }}>
              <summary style={{ display: "flex", alignItems: "center", gap: "14px", padding: "18px 0", fontWeight: "900", fontSize: "16px" }}>
                <span style={{ flex: "none", width: "32px", height: "32px", borderRadius: "50%", background: "var(--t-hl)", color: "#ffffff", fontFamily: "var(--font-dela), sans-serif", fontSize: "14px", display: "grid", placeItems: "center" }}>Q</span>
                <span style={{ flex: "1" }}>{t("faqController.q")}</span>
                <span className="faq-plus" style={{ fontSize: "24px", lineHeight: "1", color: "var(--t-hl)", transition: "transform 0.2s" }}>+</span>
              </summary>
              <p style={{ margin: "0", padding: "0 0 20px 46px", color: "var(--t-sub)" }}>{t.rich("faqController.a", { link: (c) => <Link href="/guide/x360ce" style={{ color: "var(--t-hl)", fontWeight: 700 }}>{c}</Link> })}</p>
            </details>
            <details style={{ background: "var(--t-card)", border: "var(--t-bw) solid var(--t-card-line)", borderRadius: "22px", padding: "0 22px" }}>
              <summary style={{ display: "flex", alignItems: "center", gap: "14px", padding: "18px 0", fontWeight: "900", fontSize: "16px" }}>
                <span style={{ flex: "none", width: "32px", height: "32px", borderRadius: "50%", background: "var(--t-hl)", color: "#ffffff", fontFamily: "var(--font-dela), sans-serif", fontSize: "14px", display: "grid", placeItems: "center" }}>Q</span>
                <span style={{ flex: "1" }}>{t("t20")}</span>
                <span className="faq-plus" style={{ fontSize: "24px", lineHeight: "1", color: "var(--t-hl)", transition: "transform 0.2s" }}>+</span>
              </summary>
              <p style={{ margin: "0", padding: "0 0 20px 46px", color: "var(--t-sub)" }}>{t("t21")}</p>
            </details>
          </div>
        </div>
        {/* CTA */}
        <div className="rv" style={{ position: "relative", marginTop: "120px", background: "var(--t-panel)", color: "var(--t-panel-ink)", border: "var(--t-bw) solid var(--t-card-line)", borderRadius: "44px", padding: "80px 32px 72px", textAlign: "center", overflow: "hidden" }}>
          <div aria-hidden="true" style={{ position: "absolute", left: "0", right: "0", top: "18px", fontFamily: "var(--font-dela), sans-serif", fontSize: "clamp(56px, 12vw, 160px)", lineHeight: "1", color: "rgba(255,255,255,0.06)", whiteSpace: "nowrap" }}>{"LET'S PLAY"}</div>
          <svg className="deco" width="120" height="200" viewBox="0 0 90 160" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ position: "absolute", left: "70px", top: "60px", transform: "rotate(-14deg)" }}>
            <rect x="5" y="5" width="80" height="150" rx="14"></rect>
            <path d="M36 17 h18"></path>
            <rect x="14" y="30" width="62" height="100" rx="4"></rect>
            <path d="M38 66 L56 80 L38 94 Z"></path>
          </svg>
          <svg className="deco" width="200" height="165" viewBox="0 -30 200 170" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ position: "absolute", right: "50px", bottom: "30px", transform: "rotate(10deg)" }}>
            <path d="M40 50 C40 36 54 31 70 33 L130 33 C146 31 160 36 160 50 L172 100 C176 121 150 128 138 108 L128 92 L72 92 L62 108 C50 128 24 121 28 100 Z"></path>
            <path d="M62 56 v22 M51 67 h22"></path>
            <circle cx="132" cy="60" r="5"></circle>
            <circle cx="146" cy="73" r="5"></circle>
            <path d="M100 33 V8"></path>
            <circle cx="100" cy="4" r="4"></circle>
            <path d="M90 -6 A14 14 0 0 1 110 -6"></path>
          </svg>
          <div aria-hidden="true" style={{ position: "relative", display: "flex", justifyContent: "center", gap: "14px", alignItems: "flex-end" }}>
            <span className="hop" style={{ display: "block", width: "46px", height: "40px", background: "#e58a3a", borderRadius: "50% 50% 42% 42%" }}></span>
            <span className="hop" style={{ display: "block", width: "40px", height: "36px", background: "#06dec5", borderRadius: "50% 50% 42% 42%", animationDelay: "0.15s" }}></span>
            <span className="hop" style={{ display: "block", width: "42px", height: "38px", background: "#fe4d95", borderRadius: "50% 50% 42% 42%", animationDelay: "0.3s" }}></span>
            <span className="hop" style={{ display: "block", width: "38px", height: "34px", background: "#dcc02e", borderRadius: "50% 50% 42% 42%", animationDelay: "0.45s" }}></span>
          </div>
          <h2 style={{ position: "relative", margin: "24px 0 0", fontFamily: "var(--font-dela), sans-serif", fontWeight: "400", fontSize: "clamp(28px, 4.4vw, 52px)", lineHeight: "1.35" }}>{t.rich("h22", { br: () => <br /> })}</h2>
          <p style={{ position: "relative", margin: "14px 0 0", opacity: "0.85" }}>{t("t22")}</p>
          <div style={{ position: "relative", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "14px", marginTop: "30px" }}>
            <a className="pill" href="https://discord.com/oauth2/authorize?client_id=1252429340780527714" style={{ background: "#5865f2", color: "#ffffff", textDecoration: "none", fontWeight: "900", fontSize: "17px", padding: "16px 30px", borderRadius: "999px", boxShadow: "0 6px 0 #3c45a5" }}>{t("t23")}</a>
            <a className="pill" href="https://github.com/Kamesuta/remoteplay-inviter/releases/latest/download/remoteplay-inviter-windows.zip" style={{ background: "#a4d007", color: "#16210a", textDecoration: "none", fontWeight: "900", fontSize: "17px", padding: "16px 30px", borderRadius: "999px", boxShadow: "0 6px 0 #6f8d05" }}>{t("t24")}</a>
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer style={{ marginTop: "96px", background: "var(--t-foot)", color: "var(--t-foot-ink)" }}>
        <div style={{ maxWidth: "1160px", margin: "0 auto", padding: "36px 24px", display: "flex", flexWrap: "wrap", gap: "20px 40px", alignItems: "center" }}>
          <Image src="/assets/branding/logo.png" alt="" width={36} height={36} style={{ width: "36px", height: "36px", borderRadius: "10px" }} />
          <p style={{ margin: "0", flex: "1 1 320px", fontSize: "13px" }}>{t("t25")}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px 22px", fontSize: "14px" }}>
            <a href="https://github.com/Kamesuta/remoteplay-inviter" style={{ color: "var(--t-foot-ink)" }}>GitHub</a>
            <a href="https://github.com/Kamesuta/remoteplay-inviter/releases/latest" style={{ color: "var(--t-foot-ink)" }}>{t("t26")}</a>
            <a href="https://github.com/Kamesuta/remoteplay-inviter/blob/master/LICENSE" style={{ color: "var(--t-foot-ink)" }}>MIT License</a>
          </div>
          <a className="ptop" href="#top" aria-label={t("attr1")} style={{ position: "relative", width: "56px", height: "56px", borderRadius: "50% 50% 44% 44%", background: "#a4d007", display: "block", flex: "none" }}>
            <span className="eyes" style={{ position: "absolute", left: "0", right: "0", top: "18px", display: "flex", justifyContent: "center", gap: "12px" }}>
              <i style={{ width: "7px", height: "10px", borderRadius: "4px", background: "#10202e" }}></i>
              <i style={{ width: "7px", height: "10px", borderRadius: "4px", background: "#10202e" }}></i>
            </span>
            <svg width="16" height="10" viewBox="0 0 16 10" fill="none" stroke="#10202e" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ position: "absolute", left: "20px", top: "-14px" }}><path d="M2 8l6-6 6 6"></path></svg>
          </a>
        </div>
      </footer>
    </section>
  );
}
