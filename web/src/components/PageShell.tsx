// The page background (night theme with a faint grid) and the base type
export default function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      id="top"
      style={{
        backgroundColor: "var(--t-bg)",
        backgroundImage: "linear-gradient(var(--t-grid) 1px, transparent 1px), linear-gradient(90deg, var(--t-grid) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
        color: "var(--t-ink)",
        fontFamily: "var(--font-zen), 'Hiragino Sans', sans-serif",
        fontSize: "16px",
        lineHeight: 1.8,
        minHeight: "100vh",
        width: "100%",
        minWidth: 0,
        overflowX: "clip",
      }}
    >
      {children}
    </div>
  );
}
